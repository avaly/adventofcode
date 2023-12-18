use core::fmt;
use std::fmt::Display;

#[derive(Debug)]
pub struct Rect {
    pub width: u32,
    pub height: u32,
}

impl Rect {
    pub fn area(&self) -> u32 {
        self.width * self.height
    }

    pub fn can_hold(&self, other: &Rect) -> bool {
        self.width > other.width && self.height > other.height
    }

    pub fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}

#[derive(Debug)]
pub struct Area {
    pub left: u32,
    pub top: u32,
    pub width: u32,
    pub height: u32,
}

pub type Point = (usize, usize);

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Copy)]
pub struct Coordinate {
    pub x: usize,
    pub y: usize,
}

impl Coordinate {
    pub fn neighbor(&self, dir: &Direction, max_y: usize, max_x: usize) -> Option<Self> {
        Some(match dir {
            Direction::North if self.y > 0 => Self {
                y: self.y - 1,
                x: self.x,
            },
            Direction::South if self.y < max_y - 1 => Self {
                y: self.y + 1,
                x: self.x,
            },
            Direction::West if self.x > 0 => Self {
                y: self.y,
                x: self.x - 1,
            },
            Direction::East if self.x < max_x - 1 => Self {
                y: self.y,
                x: self.x + 1,
            },
            _ => return None,
        })
    }

    pub fn neighbors(&self, max_y: usize, max_x: usize, _diagonal: bool) -> Vec<Coordinate> {
        let mut result = vec![];

        for dir in [
            Direction::North,
            Direction::South,
            Direction::West,
            Direction::East,
        ] {
            match self.neighbor(&dir, max_y, max_x) {
                Some(item) => result.push(item),
                None => {}
            }
        }
        result
    }
}

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
pub enum Direction {
    None,
    North,
    South,
    West,
    East,
}

impl Direction {
    pub fn opposite(&self) -> Self {
        match self {
            Direction::North => Direction::South,
            Direction::South => Direction::North,
            Direction::West => Direction::East,
            Direction::East => Direction::West,
            Direction::None => Direction::None,
        }
    }
}

impl Display for Direction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Direction::North => write!(f, "  ^"),
            Direction::South => write!(f, "  v"),
            Direction::West => write!(f, "  <"),
            Direction::East => write!(f, "  >"),
            Direction::None => write!(f, "  -"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case((Coordinate { y: 0, x: 0 }, Direction::North, 2, 2), None)]
    #[case((Coordinate { y: 0, x: 0 }, Direction::South, 2, 2), Some(Coordinate { y: 1, x: 0 }))]
    #[case((Coordinate { y: 0, x: 0 }, Direction::West, 2, 2), None)]
    #[case((Coordinate { y: 0, x: 0 }, Direction::East, 2, 2), Some(Coordinate { y: 0, x: 1 }))]
    #[case((Coordinate { y: 1, x: 1 }, Direction::North, 3, 3), Some(Coordinate { y: 0, x: 1 }))]
    #[case((Coordinate { y: 1, x: 1 }, Direction::South, 3, 3), Some(Coordinate { y: 2, x: 1 }))]
    #[case((Coordinate { y: 1, x: 1 }, Direction::West, 3, 3), Some(Coordinate { y: 1, x: 0 }))]
    #[case((Coordinate { y: 1, x: 1 }, Direction::East, 3, 3), Some(Coordinate { y: 1, x: 2 }))]
    #[case((Coordinate { y: 1, x: 1 }, Direction::North, 2, 2), Some(Coordinate { y: 0, x: 1 }))]
    #[case((Coordinate { y: 1, x: 1 }, Direction::South, 2, 2), None)]
    #[case((Coordinate { y: 1, x: 1 }, Direction::West, 2, 2), Some(Coordinate { y: 1, x: 0 }))]
    #[case((Coordinate { y: 1, x: 1 }, Direction::East, 2, 2), None)]
    fn test_coordinate_neighbor(
        #[case] input: (Coordinate, Direction, usize, usize),
        #[case] expected_value: Option<Coordinate>,
    ) {
        assert_eq!(input.0.neighbor(&input.1, input.2, input.3), expected_value);
    }

    #[rstest]
    #[case((Coordinate { y: 1, x: 1 }, 3, 3), vec![Coordinate { y: 0, x: 1 }, Coordinate { y: 2, x: 1 }, Coordinate { y: 1, x: 0 }, Coordinate { y: 1, x: 2 }])]
    #[case((Coordinate { y: 0, x: 0 }, 2, 2), vec![Coordinate { y: 1, x: 0 }, Coordinate { y: 0, x: 1 }])]
    #[case((Coordinate { y: 0, x: 1 }, 3, 3), vec![Coordinate { y: 1, x: 1 }, Coordinate { y: 0, x: 0 }, Coordinate { y: 0, x: 2 }])]
    fn test_coordinate_neighbors(
        #[case] input: (Coordinate, usize, usize),
        #[case] expected_value: Vec<Coordinate>,
    ) {
        assert_eq!(input.0.neighbors(input.1, input.2, false), expected_value);
    }
}
