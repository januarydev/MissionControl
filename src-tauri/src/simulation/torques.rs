use crate::simulation::quaternion::Quaternion;

pub const UPDATE_RATE_HZ: f64 = 20.0;

#[derive(Debug)]
pub struct Torques {
    attitude: Quaternion,
}

impl Torques {
    pub fn new(init_attitude: &Quaternion) -> Self {
        Self { attitude: *init_attitude }
    }
}
