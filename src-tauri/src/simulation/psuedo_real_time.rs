#[derive(Debug)]
pub struct PseudoRealTime {
    elapsed_ticks: u64,
    tick_period: std::time::Duration,
    elapsed_time_ms: f64,
    next_tick_time: std::time::Instant,
    sleeper: spin_sleep::SpinSleeper,
}

impl PseudoRealTime {
    pub fn new(base_rate_hz: f64) -> Self {
        Self {
            elapsed_ticks: 0,
            tick_period: std::time::Duration::from_secs_f64(1.0 / base_rate_hz),
            elapsed_time_ms: 0.0,
            next_tick_time: std::time::Instant::now(),
            sleeper: spin_sleep::SpinSleeper::default(),
        }
    }

    pub fn get_tick_period_s(&self) -> f64 { self.tick_period.as_secs_f64() }

    pub fn get_elapsed_time_ms(&self) -> f64 { self.elapsed_time_ms }

    pub fn check_run_tick(&self, rate_hz: f64) -> bool {
        let num_ticks = (1.0 / rate_hz / self.tick_period.as_secs_f64()).round() as u64;
        self.elapsed_ticks % num_ticks == 0
    }

    pub fn wait_for_sync(&mut self) {
        self.next_tick_time += self.tick_period;
        self.sleeper.sleep_s((self.next_tick_time - std::time::Instant::now()).as_secs_f64());

        self.elapsed_ticks += 1;
        self.elapsed_time_ms += self.tick_period.as_millis() as f64;
    }
}
