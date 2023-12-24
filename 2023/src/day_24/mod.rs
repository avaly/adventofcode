use crate::structs::{Coordinate3D, Coordinate3DFloat};

#[derive(Debug, Clone, Copy)]
struct Stone {
    position: Coordinate3D,
    velocity: Coordinate3D,
}

impl Stone {
    fn from(contents: &str) -> Self {
        let parts = contents.split(" @ ").collect::<Vec<_>>();

        let position_parts = parts[0]
            .split(", ")
            .map(|value| value.parse().unwrap())
            .collect::<Vec<isize>>();

        let position = Coordinate3D {
            x: position_parts[0],
            y: position_parts[1],
            z: position_parts[2],
        };

        let velocity_parts = parts[1]
            .split(", ")
            .map(|value| value.trim().parse().unwrap())
            .collect::<Vec<isize>>();

        let velocity = Coordinate3D {
            x: velocity_parts[0],
            y: velocity_parts[1],
            z: velocity_parts[2],
        };

        Self { position, velocity }
    }

    fn intersects(&self, other: Stone) -> bool {
        if self.velocity.x * other.velocity.y - self.velocity.y * other.velocity.x == 0 {
            return false;
        }

        let u = (self.position.y * other.velocity.x + other.velocity.y * other.position.x
            - other.position.y * other.velocity.x
            - other.velocity.y * self.position.x)
            / (self.velocity.x * other.velocity.y - self.velocity.y * other.velocity.x);

        let v = (self.position.x + self.velocity.x * u - other.position.x) / other.velocity.x;

        u > 0 && v > 0
    }

    fn intersection_point(&self, other: Stone) -> Option<Coordinate3DFloat> {
        if !self.intersects(other) {
            return None;
        }

        let self_end = Coordinate3D {
            x: self.position.x + self.velocity.x,
            y: self.position.y + self.velocity.y,
            z: self.position.z + self.velocity.z,
        };
        let other_end = Coordinate3D {
            x: other.position.x + other.velocity.x,
            y: other.position.y + other.velocity.y,
            z: other.position.z + other.velocity.z,
        };

        // slopes
        let m1 = (self_end.y - self.position.y) as f64 / (self_end.x - self.position.x) as f64;
        let m2 = (other_end.y - other.position.y) as f64 / (other_end.x - other.position.x) as f64;

        // y-intercept of line 1
        let b1 = self.position.y as f64 - m1 * self.position.x as f64;
        // y-intercept of line 2
        let b2 = other.position.y as f64 - m2 * other.position.x as f64;

        // collision x
        let x = (b2 - b1) / (m1 - m2);
        // collision y
        let y = m1 * x + b1;

        Some(Coordinate3DFloat { x, y, z: 0.0 })
    }
}

#[derive(Debug, Clone)]
struct Data {
    stones: Vec<Stone>,
}

impl Data {
    fn from(contents: &str) -> Self {
        Self {
            stones: contents.lines().map(Stone::from).collect(),
        }
    }
}

fn part1(data: Data, min: f64, max: f64) -> usize {
    let size = data.stones.len();
    let mut valid = 0;

    for i in 0..size {
        for j in i + 1..size {
            match data.stones[i].intersection_point(data.stones[j]) {
                Some(coord) => {
                    if coord.x > min && coord.x < max && coord.y > min && coord.y < max {
                        // println!("{:?}\n{:?}", data.stones[i], data.stones[j]);
                        // println!("{:?}", coord);
                        valid += 1;
                    }
                }
                None => {
                    // println!("No intersection");
                }
            }
        }
    }

    valid
}

fn part2(_data: Data) -> usize {
    return 0;
}

pub fn solve(contents: String) {
    let data = Data::from(contents.as_str());

    println!(
        "Part 1: {}",
        part1(data.clone(), 200000000000000.0, 400000000000000.0)
    );
    println!("Part 2: {}", part2(data));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case(("19, 13, 30 @ -2, 1, -2", "18, 19, 22 @ -1, -1, -2"), true)]
    #[case(("19, 13, 30 @ -2, 1, -2", "20, 25, 34 @ -2, -2, -4"), true)]
    #[case(("19, 13, 30 @ -2, 1, -2", "12, 31, 28 @ -1, -2, -1"), true)]
    #[case(("19, 13, 30 @ -2, 1, -2", "20, 19, 15 @ 1, -5, -3"), false)] // intersects in the past
    #[case(("18, 19, 22 @ -1, -1, -2", "20, 25, 34 @ -2, -2, -4"), false)] // parallel
    #[case(("18, 19, 22 @ -1, -1, -2", "12, 31, 28 @ -1, -2, -1"), true)]
    #[case(("18, 19, 22 @ -1, -1, -2", "20, 19, 15 @ 1, -5, -3"), false)] // intersects in the past
    #[case(("20, 25, 34 @ -2, -2, -4", "12, 31, 28 @ -1, -2, -1"), true)]
    #[case(("20, 25, 34 @ -2, -2, -4", "20, 19, 15 @ 1, -5, -3"), false)] // intersects in the past
    fn test_stone_intersects(#[case] input: (&str, &str), #[case] expected_value: bool) {
        assert_eq!(
            Stone::from(input.0).intersects(Stone::from(input.1)),
            expected_value
        );
    }

    #[rstest]
    #[case(("19, 13, 30 @ -2, 1, -2", "18, 19, 22 @ -1, -1, -2"), Some((14.333, 15.333, 0.0)))]
    #[case(("19, 13, 30 @ -2, 1, -2", "20, 25, 34 @ -2, -2, -4"), Some((11.667, 16.667, 0.0)))]
    #[case(("19, 13, 30 @ -2, 1, -2", "12, 31, 28 @ -1, -2, -1"), Some((6.2, 19.4, 0.0)))]
    #[case(("19, 13, 30 @ -2, 1, -2", "20, 19, 15 @ 1, -5, -3"), None)] // intersects in the past
    #[case(("18, 19, 22 @ -1, -1, -2", "20, 25, 34 @ -2, -2, -4"), None)] // parallel
    #[case(("18, 19, 22 @ -1, -1, -2", "12, 31, 28 @ -1, -2, -1"), Some((-6.0, -5.0, 0.0)))]
    #[case(("18, 19, 22 @ -1, -1, -2", "20, 19, 15 @ 1, -5, -3"), None)] // intersects in the past
    #[case(("20, 25, 34 @ -2, -2, -4", "12, 31, 28 @ -1, -2, -1"), Some((-2.0, 3.0, 0.0)))]
    #[case(("20, 25, 34 @ -2, -2, -4", "20, 19, 15 @ 1, -5, -3"), None)] // intersects in the past
    fn test_stone_intersection_point(
        #[case] input: (&str, &str),
        #[case] expected_value: Option<(f64, f64, f64)>,
    ) {
        let intersection = Stone::from(input.0).intersection_point(Stone::from(input.1));
        match intersection {
            Some(coord) => {
                assert_eq!((coord.x - expected_value.unwrap().0) < 0.001, true);
                assert_eq!((coord.y - expected_value.unwrap().1) < 0.001, true);
            }
            None => (),
        }
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 2)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents), 7.0, 27.0), expected_value);
    }

    // #[rstest]
    // #[case(include_str!("sample.txt"), 0)]
    // fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
    //     assert_eq!(part2(Data::from(contents)), expected_value);
    // }
}
