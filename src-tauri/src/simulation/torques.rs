use crate::simulation::{
    mat3::Mat3,
    quaternion::Quaternion,
    vec3::{self, Vec3},
};

pub const UPDATE_RATE_HZ: f64 = 20.0;

#[derive(Debug)]
pub struct Torques {
    inertia: Mat3,
    angular_rate: Vec3,
    attitude: Quaternion,
}

impl Torques {
    pub fn new(init_attitude: &Quaternion, inertia: &Mat3) -> Self {
        Self {
            inertia: *inertia,
            angular_rate: vec3::ZERO,
            attitude: *init_attitude,
        }
    }
}
