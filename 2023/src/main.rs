use std::env;

use file::read_file_body;

pub mod day_01;
pub mod day_02;
pub mod day_03;
pub mod day_04;
pub mod day_05;
pub mod day_06;
pub mod day_07;
pub mod day_08;
pub mod day_09;
pub mod day_10;
pub mod day_11;
// pub mod day_12;
pub mod day_13;
pub mod day_14;
pub mod day_15;
pub mod day_16;
pub mod day_17;
pub mod day_18;
pub mod day_19;
pub mod day_20;
pub mod day_21;
pub mod day_22;
pub mod day_23;
pub mod day_24;
pub mod day_25;
pub mod debug;
pub mod file;
pub mod structs;
pub mod vectors;

fn help() {
    println!("Usage: aoc PROGRAM")
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() == 2 || args.len() == 3 {
        let program = &args[1];

        let input = if args.len() == 3 {
            args[2].clone()
        } else {
            format!("src/day_{}/input.txt", program)
        };

        let contents = read_file_body(input.as_str());

        match program.as_str() {
            "01" => crate::day_01::solve(contents),
            "02" => crate::day_02::solve(contents),
            "03" => crate::day_03::solve(contents),
            "04" => crate::day_04::solve(contents),
            "05" => crate::day_05::solve(contents),
            "06" => crate::day_06::solve(contents),
            "07" => crate::day_07::solve(contents),
            "08" => crate::day_08::solve(contents),
            "09" => crate::day_09::solve(contents),
            "10" => crate::day_10::solve(contents),
            "11" => crate::day_11::solve(contents),
            // "12" => crate::day_12::solve(contents),
            "13" => crate::day_13::solve(contents),
            "14" => crate::day_14::solve(contents),
            "15" => crate::day_15::solve(contents),
            "16" => crate::day_16::solve(contents),
            "17" => crate::day_17::solve(contents),
            "18" => crate::day_18::solve(contents),
            "19" => crate::day_19::solve(contents),
            "20" => crate::day_20::solve(contents),
            "21" => crate::day_21::solve(contents),
            "22" => crate::day_22::solve(contents),
            "23" => crate::day_23::solve(contents),
            "24" => crate::day_24::solve(contents),
            "25" => crate::day_25::solve(contents),
            _ => help(),
        }
    } else {
        help()
    }
}
