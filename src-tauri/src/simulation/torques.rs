use crate::simulation::{
    mat3::Mat3,
    mat4::Mat4,
    n_body::EARTH_GRAV_PARAM_KM3_S2,
    quaternion::Quaternion,
    vec3::{self, Vec3},
};

pub const UPDATE_RATE_HZ: f64 = 20.0;

/// Solve system of linear equations using gaussian elimination to get the
/// system in row-echelon form and then back-substitute for the roots.
/// Implements the pseudocode from https://en.wikipedia.org/wiki/Gaussian_elimination.
#[allow(clippy::needless_range_loop)]
fn gaussian_elimination(lhs: Mat3, rhs: Vec3) -> Vec3 {
    let (m, n) = (3, 4);
    let (mut h, mut k) = (0, 0);
    let mut a = [
        [lhs.r1c1, lhs.r1c2, lhs.r1c3, rhs.x],
        [lhs.r2c1, lhs.r2c2, lhs.r2c3, rhs.y],
        [lhs.r3c1, lhs.r3c2, lhs.r3c3, rhs.z],
    ];
    let argmax = |col: usize, row: &usize, mat: &[[f64; 4]; 3]| -> usize {
        let mut highval: (usize, f64) = (0, 0.0);
        for idx in *row..m {
            let val = (mat[idx][col]).abs();
            if val > highval.1 {
                highval.0 = idx;
                highval.1 = val;
            }
        }
        highval.0
    };
    let swap_rows = |row1: usize, row2: usize, mat: &mut [[f64; 4]; 3]| -> () {
        for idx in 0..n {
            let tmp = mat[row1][idx];
            mat[row1][idx] = mat[row2][idx];
            mat[row2][idx] = tmp;
        }
    };

    while h < m && k < n {
        let imax = argmax(k, &h, &a);
        if a[imax][k] == 0.0 {
            k += 1;
        } else {
            swap_rows(h, imax, &mut a);
            for i in (h + 1)..m {
                let f = a[i][k] / a[h][k];
                a[i][k] = 0.0;
                for j in (k + 1)..n {
                    a[i][j] -= a[h][j] * f;
                }
            }
            h += 1;
            k += 1;
        }
    }

    let z = 1.0; // Have to assume one variable since coefficient of the determinant matrix is 0
    let y = -a[1][2] / a[1][1];
    let x = (-a[0][2] - (a[0][1] * y)) / a[0][0];
    let mut retval = Vec3 { x, y, z };
    retval.normalize();
    retval
}

#[derive(Debug)]
pub struct Torques {
    principal_inertia_moments_kg_m2: Vec3,
    inertia_axes_angle_error_rad: f64,
    angular_rate_rad_s: Vec3,
    attitude: Quaternion,
}

impl Torques {
    /// Create a new torques struct and solve for the principal moments
    /// and axes of inertia given the passed in inertia tensor.
    pub fn new(init_attitude: &Quaternion, inertia: &Mat3) -> Self {
        // Assuming provided inertia tensor is diagonal
        // Find determinants of inertia tensor invariants
        let j1 = inertia.r1c1 + inertia.r2c2 + inertia.r3c3;
        let j21 = inertia.r1c1 * inertia.r2c2 - inertia.r1c2 * inertia.r1c2;
        let j22 = inertia.r1c1 * inertia.r3c3 - inertia.r1c3 * inertia.r1c3;
        let j23 = inertia.r2c2 * inertia.r3c3 - inertia.r2c3 * inertia.r2c3;
        let j2 = j21 + j22 + j23;
        let j31 = inertia.r1c1 * inertia.r2c2 * inertia.r3c3;
        let j32 = inertia.r1c2 * inertia.r2c3 * inertia.r1c3;
        let j33 = inertia.r1c3 * inertia.r1c2 * inertia.r2c3;
        let j34 = inertia.r1c3 * inertia.r2c2 * inertia.r1c3;
        let j35 = inertia.r1c2 * inertia.r1c2 * inertia.r3c3;
        let j36 = inertia.r1c1 * inertia.r2c3 * inertia.r2c3;
        let j3 = j31 + j32 + j33 - j34 - j35 - j36;

        // Characteristic equation of tensor is:
        // lambda^3 - j1 * lambda^2 + j2 * lambda - j3 = 0

        // Get roots of characteristic equation (trigonometric solution)
        let q = (3.0 * j2 - j1.powi(2)) / 9.0;
        let r = (9.0 * -j1 * j2 - 27.0 * -j3 - 2.0 * -j1.powi(3)) / 54.0;
        let q3 = q.powi(3);
        let j1_div_3 = -j1 / 3.0;
        let phi_3 = (r / (-q3).sqrt()).acos() / 3.0;
        let sqrt_q_2 = 2.0 * (-q).sqrt();
        let pi_two_thirds = std::f64::consts::PI * 2.0 / 3.0;
        let roots = [
            sqrt_q_2 * phi_3.cos() - j1_div_3,
            sqrt_q_2 * (phi_3 + pi_two_thirds).cos() - j1_div_3,
            sqrt_q_2 * (phi_3 - pi_two_thirds).cos() - j1_div_3,
        ];

        // Create tensors to find eigenvectors corresponding to the roots (eigenvalues)
        let tensor = |lambda: f64| -> Mat3 {
            let mut newtensor = *inertia;
            newtensor.r1c1 -= lambda;
            newtensor.r2c2 -= lambda;
            newtensor.r3c3 -= lambda;
            newtensor
        };

        let principal_axis_1 = gaussian_elimination(tensor(roots[0]), vec3::ZERO);
        let principal_axis_2 = gaussian_elimination(tensor(roots[1]), vec3::ZERO);
        let principal_axis_3 = gaussian_elimination(tensor(roots[2]), vec3::ZERO);

        // Rotate principal axes and moments to align as closely as posible with body frame
        let select_moment_axes = |axis: Vec3| -> (f64, Vec3) {
            let axis1_abs = Vec3 {
                x: principal_axis_1.x.abs(),
                y: principal_axis_1.y.abs(),
                z: principal_axis_1.z.abs(),
            };
            let axis2_abs = Vec3 {
                x: principal_axis_2.x.abs(),
                y: principal_axis_2.y.abs(),
                z: principal_axis_2.z.abs(),
            };
            let axis3_abs = Vec3 {
                x: principal_axis_3.x.abs(),
                y: principal_axis_3.y.abs(),
                z: principal_axis_3.z.abs(),
            };

            let mut selected_axis_abs = axis1_abs;
            if (axis2_abs - axis).length() < (selected_axis_abs - axis).length() {
                selected_axis_abs = axis2_abs;
            }
            if (axis3_abs - axis).length() < (selected_axis_abs - axis).length() {
                selected_axis_abs = axis3_abs;
            }
            let (selected_moment, mut selected_axis) = if selected_axis_abs == axis1_abs {
                (roots[0], principal_axis_1)
            } else if selected_axis_abs == axis2_abs {
                (roots[1], principal_axis_2)
            } else {
                (roots[2], principal_axis_3)
            };

            // Flip axis if needed to point in same direction as unit vector since moment is symmetric
            if axis.dot(selected_axis) < 0.0 {
                selected_axis.negate();
            }

            (selected_moment, selected_axis)
        };

        let (a, a_axes) = select_moment_axes(vec3::UNIT_X);
        let (b, b_axes) = select_moment_axes(vec3::UNIT_Y);
        let (c, c_axes) = select_moment_axes(vec3::UNIT_Z);

        // Calculate angular distance from body axes using the rotation matrix
        let r = Mat3 {
            r1c1: a_axes.dot(vec3::UNIT_X),
            r1c2: b_axes.dot(vec3::UNIT_X),
            r1c3: c_axes.dot(vec3::UNIT_X),
            r2c1: a_axes.dot(vec3::UNIT_Y),
            r2c2: b_axes.dot(vec3::UNIT_Y),
            r2c3: c_axes.dot(vec3::UNIT_Y),
            r3c1: a_axes.dot(vec3::UNIT_Z),
            r3c2: b_axes.dot(vec3::UNIT_Z),
            r3c3: c_axes.dot(vec3::UNIT_Z),
        };

        Self {
            principal_inertia_moments_kg_m2: Vec3 { x: a, y: b, z: c },
            inertia_axes_angle_error_rad: ((r.trace() - 1.0) / 2.0).acos(),
            angular_rate_rad_s: vec3::ZERO,
            attitude: *init_attitude,
        }
    }

    /// Calculate the direction cosine matrix Q_Xx for attitude rotation from inertial to body frame.
    fn dcm_from_att(&self) -> Mat3 {
        let q1 = self.attitude.x;
        let q2 = self.attitude.y;
        let q3 = self.attitude.z;
        let q4 = self.attitude.w;
        Mat3 {
            r1c1: q1.powi(2) - q2.powi(2) - q3.powi(2) + q4.powi(2),
            r1c2: 2.0 * (q1 * q2 + q3 * q4),
            r1c3: 2.0 * (q1 * q3 - q2 * q4),
            r2c1: 2.0 * (q1 * q2 - q3 * q4),
            r2c2: -q1.powi(2) + q2.powi(2) - q3.powi(2) + q4.powi(2),
            r2c3: 2.0 * (q2 * q3 + q1 * q4),
            r3c1: 2.0 * (q1 * q3 + q2 * q4),
            r3c2: 2.0 * (q2 * q3 - q1 * q4),
            r3c3: -q1.powi(2) - q2.powi(2) + q3.powi(2) + q4.powi(2),
        }
    }

    /// Calculate simple gravity gradient torque in the body frame in Nm.
    fn gravity_gradient_torque(&self, position_eci_km: &Vec3) -> Vec3 {
        let body_frame_inertial_position_km = self.dcm_from_att() * *position_eci_km;
        let scalar = 3.0 * EARTH_GRAV_PARAM_KM3_S2 / body_frame_inertial_position_km.length().powi(5);
        Vec3 {
            x: scalar
                * body_frame_inertial_position_km.y
                * body_frame_inertial_position_km.z
                * (self.principal_inertia_moments_kg_m2.z - self.principal_inertia_moments_kg_m2.y),
            y: scalar
                * body_frame_inertial_position_km.x
                * body_frame_inertial_position_km.z
                * (self.principal_inertia_moments_kg_m2.x - self.principal_inertia_moments_kg_m2.z),
            z: scalar
                * body_frame_inertial_position_km.x
                * body_frame_inertial_position_km.y
                * (self.principal_inertia_moments_kg_m2.y - self.principal_inertia_moments_kg_m2.x),
        }
    }

    pub fn update(&mut self, position_eci_km: &Vec3) {
        let qxx = self.dcm_from_att();
        let mut qxx_inverse = qxx;
        qxx_inverse.transpose();
        let external_torque_body_frame = qxx * self.gravity_gradient_torque(position_eci_km);
        let mut angular_rate_body_frame = qxx * self.angular_rate_rad_s;

        // Calculate angular acceleration given: M_net = H_dot_rel + omega x H
        let angular_accel_body_frame = Vec3 {
            x: (external_torque_body_frame.x
                - (self.principal_inertia_moments_kg_m2.z - self.principal_inertia_moments_kg_m2.y)
                    * angular_rate_body_frame.y
                    * angular_rate_body_frame.z)
                / self.principal_inertia_moments_kg_m2.x,
            y: (external_torque_body_frame.y
                - (self.principal_inertia_moments_kg_m2.x - self.principal_inertia_moments_kg_m2.z)
                    * angular_rate_body_frame.z
                    * angular_rate_body_frame.x)
                / self.principal_inertia_moments_kg_m2.y,
            z: (external_torque_body_frame.z
                - (self.principal_inertia_moments_kg_m2.y - self.principal_inertia_moments_kg_m2.x)
                    * angular_rate_body_frame.x
                    * angular_rate_body_frame.y)
                / self.principal_inertia_moments_kg_m2.z,
        };

        // Use simple numerical estimation for integration since we're updating quickly and error should be pretty low.
        angular_rate_body_frame += angular_accel_body_frame / UPDATE_RATE_HZ;
        self.angular_rate_rad_s = qxx_inverse * angular_accel_body_frame;

        // Calculate time derivative of attitude given: q_dot = 0.5 * OMEGA * q
        let omega = Mat4 {
            r1c1: 0.0,
            r1c2: angular_rate_body_frame.z,
            r1c3: -angular_rate_body_frame.y,
            r1c4: angular_rate_body_frame.x,
            r2c1: -angular_rate_body_frame.z,
            r2c2: 0.0,
            r2c3: angular_rate_body_frame.x,
            r2c4: angular_rate_body_frame.y,
            r3c1: angular_rate_body_frame.y,
            r3c2: -angular_rate_body_frame.x,
            r3c3: 0.0,
            r3c4: angular_rate_body_frame.z,
            r4c1: -angular_rate_body_frame.x,
            r4c2: -angular_rate_body_frame.y,
            r4c3: -angular_rate_body_frame.z,
            r4c4: 0.0,
        };
        let q_dot = 0.5 * (omega * self.attitude);

        // Again, use simple numerical estimation for integration
        self.attitude += q_dot / UPDATE_RATE_HZ;
        self.attitude.normalize();
    }
}
