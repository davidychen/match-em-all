# Gotta Match 'Em All

> A flipping pokemon card game. When you flip two same card, you catch the pokemon! Compete with others and expand your collection! Try to Catch some rare pokemons like Groudon! 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/davidychen/match-em-all/blob/master/LICENSE)
[![Commit pre Month](https://img.shields.io/github/commit-activity/m/davidychen/match-em-all.svg)](https://github.com/davidychen/match-em-all/commits/master)
[![Forks](https://img.shields.io/github/forks/davidychen/match-em-all.svg?style=social)](https://github.com/davidychen/match-em-all/network/members)
[![Stars](https://img.shields.io/github/stars/davidychen/match-em-all.svg?style=social)](https://github.com/davidychen/match-em-all/stargazers)

## Getting Started

Follow the below steps and you will get the app run locally

### Prerequisites
[Node](https://nodejs.org/)
[Meteor](https://www.meteor.com/)

### Installing

Clone the repo, then open the terminal on the folder created

```sh
git clone https://github.com/davidychen/match-em-all.git
cd match-em-all
meteor npm install
```

### Run

```sh
meteor reset
meteor
```

Which will run the front-end development server on the port 3000, then visit (http://localhost:3000) and you should see the app running. The database is running on port 3001.

## Database

You can either use a local meteor database or a cloud database. If you need to use a cloud database, Just set your database url as variable MONGO_URL in .env as an environment variable. It has 2 collections: pokemon, collections. We are using the heroku add-on database.

## Deployment

Deployment is using heroku. The link is here: <https://match-em-all.herokuapp.com/>.

## Style

### Screenshots
![Landing](screenshots/landing-page.png)
![Login](screenshots/2.PNG)
![Game](screenshots/game-page.png)
![Collection1](screenshots/collection-page-1.png)
![Collection2](screenshots/collection-page-2.png)
![Profile](screenshots/profile-page.png)
![Share](screenshots/share-page.png)

### Demonstration Video
[Youtube match em all](https://youtu.be/KXSKQ-x-RoY)

### Usability Report
[Report](docs/README.md)

### Color Palette (Analogous)
- ![#9c27b0](https://placehold.it/15/9c27b0/000000?text=+) `#9c27b0`
- ![#ff9800](https://placehold.it/15/ff9800/000000?text=+) `#ff9800`
- ![#f44336](https://placehold.it/15/f44336/000000?text=+) `#f44336`
- ![#4caf50](https://placehold.it/15/4caf50/000000?text=+) `#4caf50`
- ![#00acc1](https://placehold.it/15/00acc1/000000?text=+) `#00acc1`

### Font Pairing
- Roboto (headings)
- Open Sans (paragraphs)

## Authors
* [**Yifei Chen**](https://www.davidychen.com/)
* [**Shuomin Wu**](https://simonwux.github.io/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

1. Fork it (<https://github.com/davidychen/match-em-all>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Class Link
[CS-5610 Web Development Spring 2019](http://johnguerra.co/classes/webDevelopment_spring_2019/)

