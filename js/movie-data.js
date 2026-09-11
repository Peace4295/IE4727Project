const movies = [
    {
        id: 1,
        title: "Jumanji: The Next Level",
        rating: "PG",
        genre: "Adventure, Action, Comedy",
        language: "English",
        subtitles: "English",
        duration: "2h 3m",
        poster: "images/jumanji.png",
        status: "showing",

        synopsis: "When Spencer goes back into the fantastical world of Jumanji, pals Martha, Fridge and Bethany re-enter the game to bring him home. But the game is now broken -- and fighting back. Everything the friends know about Jumanji is about to change, as they soon discover there are more obstacles and more danger to overcome.",
        director: "Jake Kasdan",
        cast: "Dwayne Johnson, Kevin Hart, Jack Black, Karen Gillan, Awkwafina",
        releaseDate: "13 December 2019"
    }, 
    {
        id: 2,
        title: "Joker",
        rating : "PG",
        genre: "Crime, Action",
        language: "English",
        subtitles: "English",
        duration: "2h 2m",
        poster: "images/joker.png",
        status: "showing",
        
        synopsis: "Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he's part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker.",
        director: "Todd Phillips",
        cast: "Joaquin Phoenix, Robert De Niro, Zazie Beetz, Frances Conroy, Brett Cullen",
        releaseDate: "3 October 2019"
    },
     {
        id: 3,
        title: "Minions",
        rating : "PG",
        genre: "Kids & Family, Animation, Comedy",
        language: "English",
        subtitles: "English",
        duration: "1h 31m",
        poster: "images/minionposter.jpg",
        status: "showing",
        
        synopsis: "Evolving from single-celled yellow organisms at the dawn of time, Minions live to serve, but find themselves working for a continual series of unsuccessful masters, from T. Rex to Napoleon. Without a master to grovel for, the Minions fall into a deep depression. But one minion, Kevin, has a plan; accompanied by his pals Stuart and Bob, Kevin sets forth to find a new evil boss for his brethren to follow. Their search leads them to Scarlet Overkill, the world's first-ever super-villainess.",
        director: "Pierre Coffin, Kyle Balda",
        cast: "Sandra Bullock, Jon Hamm, Micheal Keaton, Allison Janney",
        releaseDate: "10 July 2016"
    },
     {
        id: 4,
        title: "The Avengers",
        rating : "PG",
        genre: "Action, Adventure, Sci-Fi",
        language: "English",
        subtitles: "English",
        duration: "2h 23m",
        poster: "images/avengers.png",
        status: "showing",
        
        synopsis: "When Thor's evil brother, Loki, gains access to the unlimited power of the energy cube called the Tesseract, Nick Fury, director of S.H.I.E.L.D., initiates a superhero recruitment effort to defeat the unprecedented threat to Earth. Joining Fury's &quotdream team&quot are Iron Man, Captain America, the Hulk, Thor, the Black Widow and Hawkeye.",
        director: "Joss Whedon",
        cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson",
        releaseDate: "4 May 2012"
    },
     {
        id: 5,
        title: "Zootopia",
        rating : "PG",
        genre: "Kids & Family, Animation, Adventure",
        language: "English",
        subtitles: "English",
        duration: "1h 48m",
        poster: "images/zootopia.png",
        status: "showing",
        
        synopsis: "From the largest elephant to the smallest shrew, the city of Zootopia is a mammal metropolis where various animals live and thrive. When Judy Hopps becomes the first rabbit to join the police force, she quickly learns how tough it is to enforce the law. Determined to prove herself, Judy jumps at the opportunity to solve a mysterious case. Unfortunately, that means working with Nick Wilde, a wily fox who makes her job even harder.",
        director: "Byron Howard, Rich Moore",
        cast: "Ginnifer Goodwin, Jason Bateman, Shakira, Idris Elba",
        releaseDate: "4 March 2016"
    }
];

const studentOriginals =[
    {
        id: 6,
        title: "EXIT 19",
        rating : "PG",
        genre: "MellowDrama",
        language: "English",
        subtitles: "English",
        duration: "15m",
        poster: "images/film/exit19.png",
        status: "showing",

        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Jennifer",
        cast: "Priscilla ",
        releaseDate: "15 March 2024"
    },
    {
        id: 7,
        title: "When Petals Fall",
        rating : "PG",
        genre: "Heart-felt",
        language: "English",
        subtitles: "English",
        duration: "11m",
        poster: "images/film/wpf.png",
        status: "showing",

        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Macson Y.",
        cast: "Genelle Law",
        releaseDate: "15 March 2024"
    },
     {
        id: 8,
        title: "Requiem",
        rating : "PG",
        genre: "Dance-film",
        language: "English",
        subtitles: "English",
        duration: "9m",
        poster: "images/film/requiem.png",
        status: "showing",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Macson Y.",
        cast: "Low Ying Han",
        releaseDate: "15 March 2024"
    },
    {
        id: 9,
        title: "Would You Still Love Me If",
        rating : "PG",
        genre: "Heart-Felt",
        language: "English",
        subtitles: "English",
        duration: "11m",
        poster: "images/film/wyslmi.png",
        status: "showing",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Actor A, Actor B, Actor C",
        releaseDate: "15 March 2024"
    },
    {
        id: 10,
        title: "Temperance",
        rating : "PG",
        genre: "Dance Film",
        language: "English",
        subtitles: "English",
        duration: "9m",
        poster: "images/film/temp.png",
        status: "showing",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    }

]

const comingSoon =[
    {
        id: 11,
        title: "Future Release 1",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/minionposter.jpg",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
    {
        id: 12,
        title: "Future Release 1",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/minionposter.jpg",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
    {
        id: 13,
        title: "Future Release 1",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/minionposter.jpg",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
    {
        id: 14,
        title: "Future Release 1",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/minionposter.jpg",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
    {
        id: 15,
        title: "Future Release 1",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/minionposter.jpg",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
]