#![allow(dead_code)]

use crate::simulation::vec3::Vec3;

/// Simple row-major Mat3 implementation including basic math operations.
#[derive(Copy, Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Mat3 {
    pub r1c1: f64, pub r1c2: f64, pub r1c3: f64,
    pub r2c1: f64, pub r2c2: f64, pub r2c3: f64,
    pub r3c1: f64, pub r3c2: f64, pub r3c3: f64,
}

impl Mat3 {
    /// Perform multiplication with the given vector
    pub fn multiply_vec3(&self, vec: Vec3) -> Vec3 {
        Vec3 {
            x: self.r1c1 * vec.x + self.r1c2 * vec.y + self.r1c3 * vec.z,
            y: self.r2c1 * vec.x + self.r2c2 * vec.y + self.r2c3 * vec.z,
            z: self.r3c1 * vec.x + self.r3c2 * vec.y + self.r3c3 * vec.z,
        }
    }
}

impl std::ops::Mul<Vec3> for Mat3 {
    type Output = Vec3;
    fn mul(self, rhs: Vec3) -> Self::Output {
        self.multiply_vec3(rhs)
    }
}
