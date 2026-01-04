#![allow(dead_code)]

/// Simple Vector3 implementation including basic math operations.
#[derive(Copy, Clone, Debug, PartialEq, serde::Deserialize)]
pub struct Vec3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Vec3 {
    /// Calculate the length of the vector.
    pub fn length(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2) + self.z.powi(2)).sqrt()
    }

    /// Scale the vector by the given scalar.
    pub fn scale(&mut self, scalar: f64) {
        self.x *= scalar;
        self.y *= scalar;
        self.z *= scalar;
    }

    /// Normalize the vector to length 1.0.
    pub fn normalize(&mut self) {
        self.scale(1.0 / self.length());
    }

    /// Flip the vector to its negative.
    pub fn negate(&mut self) {
        self.scale(-1.0);
    }

    /// Peform the dot product with the given vector.
    pub fn dot(&self, v2: Self) -> f64 {
        (self.x * v2.x) + (self.y * v2.y) + (self.z * v2.z)
    }

    /// Perform the cross product with the given vector.
    pub fn cross(&self, v2: Vec3) -> Self {
        Self {
            x: (self.y * v2.z) - (v2.y * self.z),
            y: (self.z * v2.x) - (v2.z * self.x),
            z: (self.x * v2.y) - (v2.x * self.y),
        }
    }
}

impl std::ops::Add<Vec3> for Vec3 {
    type Output = Vec3;
    fn add(self, rhs: Vec3) -> Self::Output {
        Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
        }
    }
}

impl std::ops::Sub<Vec3> for Vec3 {
    type Output = Vec3;
    fn sub(self, rhs: Vec3) -> Self::Output {
        Self {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
            z: self.z - rhs.z,
        }
    }
}

impl std::ops::Mul<f64> for Vec3 {
    type Output = Vec3;
    fn mul(self, rhs: f64) -> Self::Output {
        let mut retval = self;
        retval.scale(rhs);
        retval
    }
}

impl std::ops::Mul<Vec3> for f64 {
    type Output = Vec3;
    fn mul(self, rhs: Vec3) -> Self::Output {
        let mut retval = rhs;
        retval.scale(self);
        retval
    }
}

impl std::ops::Div<f64> for Vec3 {
    type Output = Vec3;
    fn div(self, rhs: f64) -> Self::Output {
        let mut retval = self;
        retval.scale(1.0 / rhs);
        retval
    }
}

impl std::ops::Div<Vec3> for f64 {
    type Output = Vec3;
    fn div(self, rhs: Vec3) -> Self::Output {
        let mut retval = rhs;
        retval.scale(1.0 / self);
        retval
    }
}

pub const ZERO: Vec3 = Vec3 { x: 0.0, y: 0.0, z: 0.0 };
pub const UNIT_X: Vec3 = Vec3 { x: 1.0, y: 0.0, z: 0.0 };
pub const UNIT_Y: Vec3 = Vec3 { x: 0.0, y: 1.0, z: 0.0 };
pub const UNIT_Z: Vec3 = Vec3 { x: 0.0, y: 0.0, z: 1.0 };
