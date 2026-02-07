#![allow(dead_code)]

use crate::simulation::quaternion::Quaternion;

/// Simple row-major Mat4 implementation including basic math operations.
#[derive(Copy, Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Mat4 {
    pub r1c1: f64,
    pub r1c2: f64,
    pub r1c3: f64,
    pub r1c4: f64,
    pub r2c1: f64,
    pub r2c2: f64,
    pub r2c3: f64,
    pub r2c4: f64,
    pub r3c1: f64,
    pub r3c2: f64,
    pub r3c3: f64,
    pub r3c4: f64,
    pub r4c1: f64,
    pub r4c2: f64,
    pub r4c3: f64,
    pub r4c4: f64,
}

impl Mat4 {
    /// Perform multiplication with the given quaternion
    pub fn multiply_quat(&self, quat: Quaternion) -> Quaternion {
        Quaternion {
            x: self.r1c1 * quat.x + self.r1c2 * quat.y + self.r1c3 * quat.z + self.r1c4 * quat.w,
            y: self.r2c1 * quat.x + self.r2c2 * quat.y + self.r2c3 * quat.z + self.r2c4 * quat.w,
            z: self.r3c1 * quat.x + self.r3c2 * quat.y + self.r3c3 * quat.z + self.r3c4 * quat.w,
            w: self.r4c1 * quat.x + self.r4c2 * quat.y + self.r4c3 * quat.z + self.r4c4 * quat.w,
        }
    }
}

impl std::ops::Mul<Quaternion> for Mat4 {
    type Output = Quaternion;
    fn mul(self, rhs: Quaternion) -> Self::Output {
        self.multiply_quat(rhs)
    }
}
