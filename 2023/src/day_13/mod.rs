use crate::vectors::Parser;

#[derive(Debug, Clone, PartialEq)]
struct Map {
    map: Vec<Vec<u32>>,
    max_x: usize,
    max_y: usize,
}

impl Map {
    fn from(contents: &str) -> Self {
        let map = contents
            .to_char_grid()
            .iter()
            .map(|row| {
                row.iter()
                    .map(|cell| match cell {
                        '.' => 0,
                        '#' => 1,
                        _ => 9,
                    })
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        let max_x = map.get(0).unwrap().len();
        let max_y = map.len();

        Self { map, max_x, max_y }
    }

    fn is_equal_vertical(&self, index_a: usize, index_b: usize) -> bool {
        let mut equal = true;

        for y in 0..self.max_y {
            let row = self.map.get(y).unwrap();

            equal &= row.get(index_a).unwrap() == row.get(index_b).unwrap();
        }

        equal
    }

    fn find_verticals(&self) -> Vec<usize> {
        let mut mirrors = vec![];

        for mirror in 0..self.max_x - 1 {
            let mut similar = 0;
            let mut is_mirror = true;

            while mirror >= similar && mirror + 1 + similar <= self.max_x - 1 {
                is_mirror &= self.is_equal_vertical(mirror - similar, mirror + 1 + similar);
                similar += 1;
            }

            if is_mirror {
                mirrors.push(mirror + 1);
            }
        }

        mirrors
    }

    fn is_equal_horizontal(&self, index_a: usize, index_b: usize) -> bool {
        let mut equal = true;

        for x in 0..self.max_x {
            equal &= self.map.get(index_a).unwrap().get(x).unwrap()
                == self.map.get(index_b).unwrap().get(x).unwrap();
        }

        equal
    }

    fn find_horizontals(&self) -> Vec<usize> {
        let mut mirrors = vec![];

        for mirror in 0..self.max_y - 1 {
            let mut similar = 0;
            let mut is_mirror = true;

            while mirror >= similar && mirror + 1 + similar <= self.max_y - 1 {
                is_mirror &= self.is_equal_horizontal(mirror - similar, mirror + 1 + similar);
                similar += 1;
            }

            if is_mirror {
                mirrors.push((mirror + 1) * 100);
            }
        }

        mirrors
    }

    fn value_part1(&self) -> usize {
        let verticals = self.find_verticals();
        let horizontals = self.find_horizontals();

        verticals.iter().sum::<usize>() + horizontals.iter().sum::<usize>()
    }

    fn flip(&self, y: usize, x: usize) -> (Vec<usize>, Vec<usize>) {
        let value = self.map.get(y).unwrap().get(x).unwrap();

        let mut flipped = self.clone();

        let mut row = flipped.map.remove(y);
        row.remove(x);
        row.insert(x, (value + 1) % 2);
        flipped.map.insert(y, row);

        (flipped.find_verticals(), flipped.find_horizontals())
    }

    fn value_part2(&self) -> usize {
        let original_verticals = self.find_verticals();
        let original_horizontals = self.find_horizontals();

        for y in 0..self.max_y {
            for x in 0..self.max_x {
                let (verticals, horizontals) = self.flip(y, x);

                let mut vertical: usize = 0;
                let mut horizontal: usize = 0;

                if verticals.len() > 0 {
                    if original_verticals.len() > 0 {
                        for value in verticals.iter() {
                            if value != original_verticals.first().unwrap() {
                                vertical = *value;
                            }
                        }
                    } else {
                        vertical = *verticals.first().unwrap();
                    }
                }
                if horizontals.len() > 0 {
                    if original_horizontals.len() > 0 {
                        for value in horizontals.iter() {
                            if value != original_horizontals.first().unwrap() {
                                horizontal = *value;
                            }
                        }
                    } else {
                        horizontal = *horizontals.first().unwrap();
                    }
                }
                let value = vertical + horizontal;

                if value > 0 {
                    return value;
                }
            }
        }

        0
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    maps: Vec<Map>,
}

impl Data {
    fn from(contents: &str) -> Self {
        Self {
            maps: contents
                .split("\n\n")
                .into_iter()
                .map(|data| Map::from(data))
                .collect(),
        }
    }
}

fn part1(data: Data) -> usize {
    data.maps.iter().map(|item| item.value_part1()).sum()
}

fn part2(data: Data) -> usize {
    data.maps.iter().map(|item| item.value_part2()).sum()
}

pub fn solve(contents: String) {
    let data = Data::from(contents.as_str());

    println!("Part 1: {}", part1(data.clone()));
    println!("Part 2: {}", part2(data));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case(include_str!("sample-1.txt"), vec![5])]
    fn test_map_vertical(#[case] contents: &str, #[case] expected_value: Vec<usize>) {
        assert_eq!(Map::from(contents).find_verticals(), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample-2.txt"), vec![400])]
    fn test_map_horizontal(#[case] contents: &str, #[case] expected_value: Vec<usize>) {
        assert_eq!(Map::from(contents).find_horizontals(), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 405)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample-1.txt"), 300)]
    #[case(include_str!("sample-2.txt"), 100)]
    #[case(include_str!("sample.txt"), 400)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
