use core::fmt;
use std::{fmt::Display, usize::MAX};

use crate::vectors::Parser;

type Point = (usize, usize);

const PIPE: usize = 5;

#[derive(Debug, Clone, Copy, PartialEq)]
enum Piece {
    Empty,
    Start,
    EW,
    NS,
    NE,
    NW,
    SE,
    SW,
}

impl Display for Piece {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Piece::Empty => write!(f, "."),
            Piece::Start => write!(f, "S"),
            Piece::NS => write!(f, "|"),
            Piece::EW => write!(f, "―"),
            Piece::NW => write!(f, "⅃"),
            Piece::NE => write!(f, "∟"),
            Piece::SW => write!(f, "⅂"),
            Piece::SE => write!(f, "⟌"),
        }
    }
}

fn has_north(piece: Piece) -> bool {
    piece == Piece::NS || piece == Piece::NE || piece == Piece::NW
}

fn has_south(piece: Piece) -> bool {
    piece == Piece::NS || piece == Piece::SE || piece == Piece::SW
}

fn has_west(piece: Piece) -> bool {
    piece == Piece::EW || piece == Piece::NW || piece == Piece::SW
}

fn has_east(piece: Piece) -> bool {
    piece == Piece::EW || piece == Piece::NE || piece == Piece::SE
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    map: Vec<Vec<Piece>>,
    max_x: usize,
    max_y: usize,
    start: Point,
    start_piece: Piece,
}

impl Data {
    fn from(contents: &str) -> Self {
        let chars = contents.to_char_grid();
        let max_y = chars.len();
        let max_x = chars.get(0).unwrap().len();

        let mut start = (0, 0);

        let map = chars
            .iter()
            .map(|line| {
                line.iter()
                    .map(|piece| match piece {
                        'S' => Piece::Start,
                        '|' => Piece::NS,
                        '-' => Piece::EW,
                        'L' => Piece::NE,
                        'J' => Piece::NW,
                        '7' => Piece::SW,
                        'F' => Piece::SE,
                        _ => Piece::Empty,
                    })
                    .collect::<Vec<_>>()
                // .as_mut_slice()
            })
            .collect::<Vec<_>>();
        // .as_mut_slice();

        let mut start_piece = Piece::Start;

        chars.iter().enumerate().for_each(|(y, line)| {
            line.iter().enumerate().for_each(|(x, value)| {
                if value == &'S' {
                    start = (y, x);

                    let north = if y > 0 {
                        *map.get(y - 1).unwrap().get(x).unwrap()
                    } else {
                        Piece::Empty
                    };
                    let south = if y < max_y - 1 {
                        *map.get(y + 1).unwrap().get(x).unwrap()
                    } else {
                        Piece::Empty
                    };
                    let west = if x > 0 {
                        *map.get(y).unwrap().get(x - 1).unwrap()
                    } else {
                        Piece::Empty
                    };
                    let east = if x < max_x - 1 {
                        *map.get(y).unwrap().get(x + 1).unwrap()
                    } else {
                        Piece::Empty
                    };

                    if has_south(north) && has_north(south) {
                        start_piece = Piece::NS;
                    }
                    if has_east(west) && has_west(east) {
                        start_piece = Piece::EW;
                    }
                    if has_south(north) && has_east(west) {
                        start_piece = Piece::NW;
                    }
                    if has_south(north) && has_west(east) {
                        start_piece = Piece::NE;
                    }
                    if has_north(south) && has_east(west) {
                        start_piece = Piece::SW;
                    }
                    if has_north(south) && has_west(east) {
                        start_piece = Piece::SE;
                    }
                }
            });
        });

        Self {
            map,
            max_x,
            max_y,
            start,
            start_piece,
        }
    }

    fn next(&self, previous: Point, current: Point) -> Point {
        let (y, x) = current;
        let mut next = (y, x);

        match self.map.get(y).unwrap().get(x).unwrap() {
            Piece::EW => {
                if previous == (y, x - 1) {
                    next.1 = x + 1;
                } else {
                    next.1 = x - 1;
                }
            }
            Piece::NS => {
                if previous == (y - 1, x) {
                    next.0 = y + 1;
                } else {
                    next.0 = y - 1;
                }
            }
            Piece::NE => {
                if previous == (y - 1, x) {
                    next.1 = x + 1;
                } else {
                    next.0 = y - 1;
                }
            }
            Piece::NW => {
                if previous == (y - 1, x) {
                    next.1 = x - 1;
                } else {
                    next.0 = y - 1;
                }
            }
            Piece::SE => {
                if previous == (y + 1, x) {
                    next.1 = x + 1;
                } else {
                    next.0 = y + 1;
                }
            }
            Piece::SW => {
                if previous == (y + 1, x) {
                    next.1 = x - 1;
                } else {
                    next.0 = y + 1;
                }
            }
            _ => (),
        }
        next
    }

    fn debug(&self) {
        // print!("      ");
        // for x in 0..self.max_x {
        //     print!("{: >3} ", x);
        // }
        // println!("");

        print!("-----");
        for _ in 0..self.max_x {
            print!("--");
        }
        println!("");

        for y in 0..self.max_y {
            print!("{: >3} | ", y);
            for x in 0..self.max_x {
                print!("{} ", self.map.get(y).unwrap().get(x).unwrap());
            }
            println!("");
        }

        print!("-----");
        for _ in 0..self.max_x {
            print!("--");
        }
        println!("");
    }
}

fn move_in_pipe(data: &Data, previous: Point, current: Point, distances: &mut [&mut [usize]]) {
    let (y, x) = current;
    let previous_distance = distances[previous.0][previous.1];

    let next = data.next(previous, current);

    if previous_distance == MAX {
        return;
    }
    if y == next.0 && x == next.1 {
        return;
    }

    if distances[y][x] > previous_distance + 1 {
        distances[y][x] = previous_distance + 1;

        move_in_pipe(data, current, next, distances);
    }
}

fn fill_pipe(data: &Data, previous: Point, current: Point, fill: &mut [&mut [usize]]) {
    let (y, x) = current;
    let next = data.next(previous, current);

    fill[y][x] = PIPE;

    if y == next.0 && x == next.1 {
        return;
    }

    fill_pipe(data, current, next, fill);
}

fn start_moves(data: &Data) -> [(usize, usize); 2] {
    match data.start_piece {
        Piece::EW => [
            (data.start.0, data.start.1 + 1),
            (data.start.0, data.start.1 - 1),
        ],
        Piece::NS => [
            (data.start.0 - 1, data.start.1),
            (data.start.0 + 1, data.start.1),
        ],
        Piece::NE => [
            (data.start.0, data.start.1 + 1),
            (data.start.0 - 1, data.start.1),
        ],
        Piece::NW => [
            (data.start.0, data.start.1 - 1),
            (data.start.0 - 1, data.start.1),
        ],
        Piece::SE => [
            (data.start.0, data.start.1 + 1),
            (data.start.0 + 1, data.start.1),
        ],
        Piece::SW => [
            (data.start.0, data.start.1 - 1),
            (data.start.0 + 1, data.start.1),
        ],
        _ => panic!("Unexpected case"),
    }
}

fn part1(data: Data) -> usize {
    let mut distances_raw = vec![MAX; data.max_y * data.max_x];
    let mut distances_vec: Vec<_> = distances_raw
        .as_mut_slice()
        .chunks_mut(data.max_x)
        .collect();
    let distances = distances_vec.as_mut_slice();

    distances[data.start.0][data.start.1] = 0;

    let moves = start_moves(&data);

    for position in moves {
        move_in_pipe(&data, data.start, position, distances);
    }

    let mut max = 0;

    for y in 0..data.max_y {
        for x in 0..data.max_x {
            if distances[y][x] < MAX && distances[y][x] > max {
                max = distances[y][x];
            }
        }
    }

    return max;
}

fn part2(data: Data) -> usize {
    // data.debug();

    let mut fill_raw = vec![0; data.max_y * data.max_x];
    let mut fill_vec: Vec<_> = fill_raw.as_mut_slice().chunks_mut(data.max_x).collect();
    let fill = fill_vec.as_mut_slice();

    let moves = start_moves(&data);

    fill_pipe(&data, data.start, moves[0], fill);

    // dbg_matrix_as_slice(fill);

    for y in 0..data.max_y {
        let mut edges = 0;
        let mut last_corner = Piece::Empty;

        for x in 0..data.max_x {
            let mut piece = *data.map.get(y).unwrap().get(x).unwrap();
            if piece == Piece::Start {
                piece = data.start_piece;
            }

            if fill[y][x] == PIPE {
                if piece == Piece::NS {
                    edges += 1;
                }
                if piece == Piece::NE || piece == Piece::SE {
                    last_corner = piece;
                }
                if piece == Piece::NW || piece == Piece::SW {
                    if (piece == Piece::NW && last_corner == Piece::SE)
                        || (piece == Piece::SW && last_corner == Piece::NE)
                    {
                        edges += 1;
                    }
                    last_corner = Piece::Empty;
                }
                // println!("{},{} = {} -> {}", y, x, piece, edges);
            }

            if fill[y][x] < PIPE {
                // println!("{},{} = {}", y, x, edges);
                if edges % 2 == 1 {
                    fill[y][x] += 1;
                }
            }
        }
    }

    // dbg_matrix_as_slice(fill);

    let mut count = 0;

    for y in 0..data.max_y {
        for x in 0..data.max_x {
            if fill[y][x] == 1 {
                count += 1;
            }
        }
    }

    count
}

pub fn solve(contents: String) {
    // println!("{}", contents);

    let data = Data::from(contents.as_str());

    println!("Part 1: {}", part1(data.clone()));
    println!("Part 2: {}", part2(data));
    // 524 too low
    // next try: 529
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case(include_str!("sample.txt"), 4)]
    #[case(include_str!("sample2.txt"), 4)]
    #[case(include_str!("sample3.txt"), 8)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample4.txt"), 4)]
    #[case(include_str!("sample4-wide.txt"), 4)]
    #[case(include_str!("sample5.txt"), 8)]
    #[case(include_str!("sample6.txt"), 10)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
// dbg!(&fill);
