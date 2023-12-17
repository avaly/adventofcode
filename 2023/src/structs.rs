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

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
pub enum Direction {
    None,
    North,
    South,
    West,
    East,
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
