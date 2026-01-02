mod psuedo_real_time;

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationState {
    elapsed_time_ms: f64
}

#[derive(Debug)]
pub struct Simulation {
    time_source: psuedo_real_time::PseudoRealTime,
}

impl Simulation {
    pub fn new(base_rate_hz: f64) -> Self {
        Self {
            time_source: psuedo_real_time::PseudoRealTime::new(base_rate_hz)
        }
    }

    pub fn iterate(&mut self) -> SimulationState {
        self.time_source.wait_for_sync();

        SimulationState {
            elapsed_time_ms: self.time_source.get_elapsed_time_ms()
        }
    }
}
