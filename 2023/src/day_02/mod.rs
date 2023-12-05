use std::cmp;

use regex::Regex;
use rstest::*;

use crate::file::read_file_lines;

#[derive(Debug)]
struct Cubes {
    red: u8,
    green: u8,
    blue: u8,
}

#[derive(Debug)]
struct Game {
    number: u32,
    cubes: Vec<Cubes>,
}

impl Game {
    fn is_possible(&self) -> bool {
        self.cubes
            .iter()
            .all(|cube| cube.red <= 12 && cube.green <= 13 && cube.blue <= 14)
    }

    fn power(&self) -> u32 {
        let mut max = (1, 1, 1);

        for cube in self.cubes.iter() {
            max.0 = cmp::max(max.0, cube.red);
            max.1 = cmp::max(max.1, cube.green);
            max.2 = cmp::max(max.2, cube.blue);
        }

        return u32::from(max.0) * u32::from(max.1) * u32::from(max.2);
    }
}

fn parse_game(line: String) -> Game {
    let mut result = Game {
        number: 0,
        cubes: vec![],
    };

    let re_game = Regex::new(r"^Game (\d+): (.+)$").unwrap();
    let game_captures = re_game.captures(line.as_str()).unwrap();

    result.number = game_captures.get(1).unwrap().as_str().parse().unwrap();

    let re_reveals = Regex::new(r"(\d+) (red|green|blue)").unwrap();
    let reveals: Vec<&str> = game_captures.get(2).unwrap().as_str().split("; ").collect();
    for reveal in reveals {
        let mut cubes = Cubes {
            red: 0,
            green: 0,
            blue: 0,
        };
        for (_, [number, color]) in re_reveals.captures_iter(reveal).map(|c| c.extract()) {
            let number = number.parse().unwrap();
            match color {
                "red" => cubes.red = number,
                "green" => cubes.green = number,
                "blue" => cubes.blue = number,
                _ => continue,
            }
        }
        result.cubes.push(cubes);
    }

    return result;
}

fn part1(lines: Vec<&str>) -> u32 {
    return lines
        .iter()
        .filter_map(|line| {
            let game = parse_game(line.to_string());
            if game.is_possible() {
                return Some(game.number);
            } else {
                return None;
            }
        })
        .sum();
}

fn part2(lines: Vec<&str>) -> u32 {
    return lines
        .iter()
        .filter_map(|line| {
            let game = parse_game(line.to_string());
            return Some(game.power());
        })
        .sum();
}

pub fn solve(input: String) {
    let lines = input.lines().collect::<Vec<_>>();

    println!("Part 1: {}", part1(lines.clone()));

    println!("Part 2: {}", part2(lines));
}

#[rstest]
#[case("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green", true)]
#[case(
    "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    true
)]
#[case(
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    false
)]
#[case(
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    false
)]
#[case("Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green", true)]
fn test_part1(#[case] line: String, #[case] expected_value: bool) {
    let game = parse_game(line);
    assert_eq!(game.is_possible(), expected_value);
}

#[rstest]
#[case("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green", 48)]
#[case("Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue", 12)]
#[case(
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    1560
)]
#[case(
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    630
)]
#[case("Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green", 36)]
fn test_part2(#[case] line: String, #[case] expected_value: u32) {
    let game = parse_game(line);
    assert_eq!(game.power(), expected_value);
}
