#![allow(dead_code)]

/// Simple quaternion implementation including basic math operations.
#[derive(Copy, Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Quaternion {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub w: f64,
}

impl Quaternion {
    /// Calculate the magnitude/length of the quaternion.
    pub fn length(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2) + self.z.powi(2) + self.w.powi(2)).sqrt()
    }

    /// Scale the quaternion by the given amount.
    pub fn scale(&mut self, scalar: f64) {
        self.x *= scalar;
        self.y *= scalar;
        self.z *= scalar;
        self.w *= scalar;
    }

    /// Normalize the quaternion to the unit equivalent.
    pub fn normalize(&mut self) {
        self.scale(1.0 / self.length());
    }
}

impl std::ops::Add<Quaternion> for Quaternion {
    type Output = Self;
    fn add(self, rhs: Self) -> Self::Output {
        Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
            w: self.w + rhs.w,
        }
    }
}

impl std::ops::AddAssign<Quaternion> for Quaternion {
    fn add_assign(&mut self, rhs: Self) {
        *self = Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
            w: self.w + rhs.w,
        }
    }
}

impl std::ops::Sub<Quaternion> for Quaternion {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self::Output {
        Self {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
            z: self.z - rhs.z,
            w: self.w - rhs.w,
        }
    }
}

impl std::ops::SubAssign<Quaternion> for Quaternion {
    fn sub_assign(&mut self, rhs: Self) {
        *self = Self {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
            z: self.z - rhs.z,
            w: self.w - rhs.w,
        }
    }
}

impl std::ops::Mul<f64> for Quaternion {
    type Output = Self;
    fn mul(self, rhs: f64) -> Self::Output {
        let mut retval = self;
        retval.scale(rhs);
        retval
    }
}

impl std::ops::MulAssign<f64> for Quaternion {
    fn mul_assign(&mut self, rhs: f64) {
        self.scale(rhs);
    }
}

impl std::ops::Mul<Quaternion> for f64 {
    type Output = Quaternion;
    fn mul(self, rhs: Quaternion) -> Self::Output {
        let mut retval = rhs;
        retval.scale(self);
        retval
    }
}

impl std::ops::Div<f64> for Quaternion {
    type Output = Self;
    fn div(self, rhs: f64) -> Self::Output {
        let mut retval = self;
        retval.scale(1.0 / rhs);
        retval
    }
}

impl std::ops::DivAssign<f64> for Quaternion {
    fn div_assign(&mut self, rhs: f64) {
        self.scale(1.0 / rhs);
    }
}

impl std::ops::Div<Quaternion> for f64 {
    type Output = Quaternion;
    fn div(self, rhs: Quaternion) -> Self::Output {
        let mut retval = rhs;
        retval.scale(1.0 / self);
        retval
    }
}

pub const ZERO: Quaternion = Quaternion {
    x: 0.0,
    y: 0.0,
    z: 0.0,
    w: 0.0,
};
pub const IDENTITY: Quaternion = Quaternion {
    x: 0.0,
    y: 0.0,
    z: 0.0,
    w: 1.0,
};
