// use crate::vectors::Parser;
use std::cmp::Ordering;

#[derive(Debug, Clone, Eq, PartialEq, Ord, PartialOrd)]
enum HandType {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
}

#[derive(Debug, Clone, Eq, PartialEq, PartialOrd)]
struct Hand {
    bid: usize,
    cards: [u32; 5],
    hand_type: HandType,
}

impl Hand {
    fn from(contents: &str) -> Self {
        let parts: Vec<&str> = contents.split(" ").collect();

        let cards: Vec<u32> = parts
            .first()
            .unwrap()
            .chars()
            .into_iter()
            .map(|ch| match ch {
                'T' => 10,
                'J' => 11,
                'Q' => 12,
                'K' => 13,
                'A' => 14,
                _ => ch.to_digit(10).unwrap(),
            })
            .collect();

        Self {
            bid: parts.last().unwrap().parse().unwrap(),
            cards: cards.clone().try_into().unwrap(),
            hand_type: Self::get_type(cards),
        }
    }

    fn from_joker(contents: &str) -> Self {
        let mut result = Self::from(contents);

        result.cards = result.cards.map(|card| if card == 11 { 1 } else { card });

        if result.cards.contains(&1) {
            let mut hand_type = result.hand_type;

            for replace in 2u32..=14u32 {
                if replace == 11 {
                    continue;
                }

                let new_cards: Vec<u32> = result
                    .cards
                    .clone()
                    .iter()
                    .map(|card| if card == &1 { replace } else { *card })
                    .collect();

                let new_type = Self::get_type(new_cards);

                if new_type > hand_type {
                    hand_type = new_type;
                }
            }
            result.hand_type = hand_type;
        }

        return result;
    }

    fn get_type(cards: Vec<u32>) -> HandType {
        let mut counts = [0; 15];

        for card in cards {
            counts[card as usize] += 1;
        }
        counts.sort();
        counts.reverse();

        match counts[0] {
            5 => HandType::FiveOfAKind,
            4 => HandType::FourOfAKind,
            3 => {
                if counts[1] == 2 {
                    HandType::FullHouse
                } else {
                    HandType::ThreeOfAKind
                }
            }
            2 => {
                if counts[1] == 2 {
                    HandType::TwoPair
                } else {
                    HandType::OnePair
                }
            }
            _ => HandType::HighCard,
        }
    }
}

impl Ord for Hand {
    fn cmp(&self, other: &Self) -> Ordering {
        let mut result = self.hand_type.cmp(&other.hand_type);
        if result != Ordering::Equal {
            return result;
        }

        for i in 0..5 {
            result = self.cards[i].cmp(&other.cards[i]);
            if result != Ordering::Equal {
                return result;
            }
        }

        return Ordering::Equal;
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    hands: Vec<Hand>,
}

impl Data {
    fn from(contents: &str) -> Self {
        Self {
            hands: contents
                .lines()
                .into_iter()
                .map(|line| Hand::from(line))
                .collect(),
        }
    }

    fn from_joker(contents: &str) -> Self {
        Self {
            hands: contents
                .lines()
                .into_iter()
                .map(|line| Hand::from_joker(line))
                .collect(),
        }
    }
}

fn part1(mut data: Data) -> usize {
    data.hands.sort_by(|a, b| a.cmp(b));

    let mut result = 0;
    for (rank, hand) in data.hands.iter().enumerate() {
        result += (rank + 1) * hand.bid;
    }
    return result;
}

fn part2(data: Data) -> usize {
    return part1(data);
}

pub fn solve(contents: String) {
    println!("Part 1: {}", part1(Data::from(contents.as_str())));
    println!("Part 2: {}", part2(Data::from_joker(contents.as_str())));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case("55555 123", Hand { bid: 123, cards: [5, 5, 5, 5, 5], hand_type: HandType::FiveOfAKind })]
    #[case("555A5 12", Hand { bid: 12, cards: [5, 5, 5, 14, 5], hand_type: HandType::FourOfAKind })]
    #[case("5A5A5 12", Hand { bid: 12, cards: [5, 14, 5, 14, 5], hand_type: HandType::FullHouse })]
    #[case("22523 12", Hand { bid: 12, cards: [2, 2, 5, 2, 3], hand_type: HandType::ThreeOfAKind })]
    #[case("22353 12", Hand { bid: 12, cards: [2, 2, 3, 5, 3], hand_type: HandType::TwoPair })]
    #[case("32T3K 765", Hand { bid: 765, cards: [3, 2, 10, 3, 13], hand_type: HandType::OnePair })]
    #[case("92345 765", Hand { bid: 765, cards: [9, 2, 3, 4, 5], hand_type: HandType::HighCard })]
    fn test_parse_hand(#[case] input: &str, #[case] expected_value: Hand) {
        assert_eq!(Hand::from(input), expected_value);
    }

    #[rstest]
    #[case("KK677 1", Hand { bid: 1, cards: [13, 13, 6, 7, 7], hand_type: HandType::TwoPair })]
    #[case("T55J5 1", Hand { bid: 1, cards: [10, 5, 5, 1, 5], hand_type: HandType::FourOfAKind })]
    #[case("KTJJT 1", Hand { bid: 1, cards: [13, 10, 1, 1, 10], hand_type: HandType::FourOfAKind })]
    #[case("QQQJA 1", Hand { bid: 1, cards: [12, 12, 12, 1, 14], hand_type: HandType::FourOfAKind })]
    fn test_parse_hand_joker(#[case] input: &str, #[case] expected_value: Hand) {
        assert_eq!(Hand::from_joker(input), expected_value);
    }

    #[rstest]
    #[case(("KK677 1", "32T3K 1"), Ordering::Greater)]
    #[case(("32T3K 1", "KK677 1"), Ordering::Less)]
    #[case(("KTJJT 1", "KK677 1"), Ordering::Less)]
    #[case(("QQQJA 1", "KTJJT 1"), Ordering::Greater)]
    #[case(("QQQJA 1", "T55J5 1"), Ordering::Greater)]
    #[case(("QQQJA 1", "QQQJA 1"), Ordering::Equal)]
    fn test_sort_hands(#[case] inputs: (&str, &str), #[case] expected_value: Ordering) {
        assert_eq!(
            Hand::from(inputs.0).cmp(&Hand::from(inputs.1)),
            expected_value
        );
    }

    #[rstest]
    #[case(("KK677 1", "32T3K 1"), Ordering::Greater)]
    #[case(("32T3K 1", "KK677 1"), Ordering::Less)]
    #[case(("KTJJT 1", "KK677 1"), Ordering::Greater)]
    #[case(("QQQJA 1", "KTJJT 1"), Ordering::Less)]
    #[case(("QQQJA 1", "T55J5 1"), Ordering::Greater)]
    #[case(("QQQJA 1", "QQQJA 1"), Ordering::Equal)]
    fn test_sort_hands_joker(#[case] inputs: (&str, &str), #[case] expected_value: Ordering) {
        assert_eq!(
            Hand::from_joker(inputs.0).cmp(&Hand::from_joker(inputs.1)),
            expected_value
        );
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 6440)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 5905)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from_joker(contents)), expected_value);
    }
}
