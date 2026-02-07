use crate::simulation::{
    mat3::Mat3,
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
    inertia_tensor: Mat3,
    principal_inertia_moments: Vec3,
    principal_inertia_axes: [Vec3; 3],
    angular_rate: Vec3,
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
        let mut roots = [
            sqrt_q_2 * phi_3.cos() - j1_div_3,
            sqrt_q_2 * (phi_3 - pi_two_thirds).cos() - j1_div_3,
            sqrt_q_2 * (phi_3 + pi_two_thirds).cos() - j1_div_3,
        ];
        roots.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let lambda1 = roots[0];
        let lambda2 = roots[1];
        let lambda3 = roots[2];

        // Create tensors to find eigenvectors corresponding to the roots (eigenvalues)
        let tensor = |lambda: f64| -> Mat3 {
            let mut newtensor = *inertia;
            newtensor.r1c1 -= lambda;
            newtensor.r2c2 -= lambda;
            newtensor.r3c3 -= lambda;
            newtensor
        };

        Self {
            inertia_tensor: *inertia,
            principal_inertia_moments: Vec3 {
                x: lambda1,
                y: lambda2,
                z: lambda3,
            },
            principal_inertia_axes: [
                gaussian_elimination(tensor(lambda1), vec3::ZERO),
                gaussian_elimination(tensor(lambda2), vec3::ZERO),
                gaussian_elimination(tensor(lambda3), vec3::ZERO),
            ],
            angular_rate: vec3::ZERO,
            attitude: *init_attitude,
        }
    }
}
