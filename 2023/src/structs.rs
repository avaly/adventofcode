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
