use crate::day_01::run_01;
use crate::guess::sample;
use std::env;

pub mod day_01;
pub mod file;
pub mod guess;
pub mod structs;

fn help() {
    println!("Usage: aoc PROGRAM")
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() == 3 {
        let program = &args[1];
        let input = &args[2];

        match program.as_str() {
            "01" => run_01::main(input),
            "guess" => sample::sample_run(),
            _ => help(),
        }
    } else {
        help()
    }
}
