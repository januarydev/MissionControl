#[derive(Debug)]
pub struct PseudoRealTime {
    elapsed_ticks: u64,
    tick_period: std::time::Duration,
    elapsed_time_ms: f64,
    next_tick_time: std::time::Instant,
}

impl PseudoRealTime {
    pub fn new(base_rate_hz: f64) -> Self {
        Self {
            elapsed_ticks: 0,
            tick_period: std::time::Duration::from_secs_f64(1.0 / base_rate_hz),
            elapsed_time_ms: 0.0,
            next_tick_time: std::time::Instant::now(),
        }
    }

    pub fn get_elapsed_time_ms(&self) -> f64 {
        self.elapsed_time_ms
    }

    pub fn wait_for_sync(&mut self) {
        self.next_tick_time += self.tick_period;
        let sleep_duration = self.next_tick_time - std::time::Instant::now();
        std::thread::sleep(sleep_duration);

        self.elapsed_ticks += 1;
        self.elapsed_time_ms += self.tick_period.as_millis() as f64;
    }
}
