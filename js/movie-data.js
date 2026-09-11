const movies = [
    {
        id: 1,
        title: "Jumanji: The Next Level",
        rating: "PG",
        genre: "Adventure, Action, Comedy",
        language: "English",
        subtitles: "English",
        duration: "2h 3m",
        poster: "images/movie/jumanji.png",
        status: "showing",

        synopsis: "When Spencer goes back into the fantastical world of Jumanji, pals Martha, Fridge and Bethany re-enter the game to bring him home. But the game is now broken -- and fighting back. Everything the friends know about Jumanji is about to change, as they soon discover there are more obstacles and more danger to overcome.",
        director: "Jake Kasdan",
        cast: "Dwayne Johnson, Kevin Hart, Jack Black, Karen Gillan, Awkwafina",
        releaseDate: "13 December 2019"
    }, 
    {
        id: 2,
        title: "Joker",
        rating : "NC16",
        genre: "Crime, Action, Thriller",
        language: "English",
        subtitles: "English",
        duration: "2h 2m",
        poster: "images/movie/joker.png",
        status: "showing",
        
        synopsis: "Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he's part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker.",
        director: "Todd Phillips",
        cast: "Joaquin Phoenix, Robert De Niro, Zazie Beetz, Frances Conroy, Brett Cullen",
        releaseDate: "3 October 2019"
    },
     {
        id: 3,
        title: "Minions",
        rating : "G",
        genre: "Kids & Family, Animation, Comedy",
        language: "English",
        subtitles: "English",
        duration: "1h 31m",
        poster: "images/movie/minionposter.jpg",
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
        poster: "images/movie/avengers.png",
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
        poster: "images/movie/zootopia.png",
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
        genre: "Drama",
        language: "English, Chinese",
        subtitles: "English, Chinese",
        duration: "47m",
        poster: "images/film/exit19.png",
        status: "showing",

        synopsis: "On the eve of entering university, a reserved teenager finds themselves trapped in the passenger seat during a long, nocturnal drive. As the highway lights blur outside, the confined car becomes a crucible for unspoken tension. The film explores the heavy realization that growing up means inheriting the silent conflicts, messy compromises, and hidden griefs of the adults around them.",
        director: "Jennifer Heng",
        cast: "Priscilla Chong, Adrian Toh, Zelda Tatiana Ng, Christina Choy",
        releaseDate: "23 June 2024"
    },
    {
        id: 7,
        title: "When Petals Fall",
        rating : "PG",
        genre: "Drama, Dance",
        language: "English",
        subtitles: "English",
        duration: "24m",
        poster: "images/film/wpf.png",
        status: "showing",

        synopsis: "One spotlight. A breaking point. A dancer's search for herself. Driven by physical intensity and raw vulnerability, When Petals Fall pulls back the curtain on the sacrifices, isolation, and mental strain behind the pursuit of artistic perfection.",
        director: "Yap Macson",
        cast: "Genelle Law",
        releaseDate: "15 September 2024"
    },
     {
        id: 8,
        title: "Requiem",
        rating : "PG13",
        genre: "Mystery, Drama",
        language: "English",
        subtitles: "English",
        duration: "16m",
        poster: "images/film/requiem.png",
        status: "showing",
        
        synopsis: "When reality splits between an upside-down horizon and an empty field of chairs, a grieving man confronts the hidden void carried on his back.",
        director: "Yap Macson",
        cast: "Low Ying Han",
        releaseDate: "12 April 2025"
    },
    {
        id: 9,
        title: "Would You Still Love Me If",
        rating : "PG",
        genre: "Comedy, Drama",
        language: "English",
        subtitles: "English",
        duration: "16m",
        poster: "images/film/wyslmi.png",
        status: "showing",
        
        synopsis: "An earnest partner goes above and beyond in the kitchen, determined to prove that everyday devotion can outlast relationship anxieties and burning questions.",
        director: "Cheyenne Raine Lim",
        cast: "Benjamin Eio, Faye Loy, Ava Chu",
        releaseDate: "27 March 2024"
    },
    {
        id: 10,
        title: "Temperance",
        rating : "PG",
        genre: "Dance",
        language: "English",
        subtitles: "English",
        duration: "12m",
        poster: "images/film/temp.png",
        status: "showing",
        
        synopsis: "Pinned under a solitary spotlight and encircled by accusing fingers, a dancer battles against judgment, restraint, and societal scrutiny.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "19 February 2025"
    }

]

const comingSoon =[
    {
        id: 11,
        title: "The Dark Knight Rises",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/coming soon/batman.png",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
    {
        id: 12,
        title: "The Greatest Showman",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/coming soon/greatestshowman.png",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
    {
        id: 13,
        title: "Frozen",
        rating : "PG13",
        genre: "Action, Adventure, Sci-Fi",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/coming soon/frozen.png",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Steven Caple Jr.",
        cast: "Anthony Ramos, Dominique Fishback, Luna Lauren Velez",
    },
    {
        id: 14,
        title: "Transformers: Rise of the Beasts",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/coming soon/transformers.png",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
    {
        id: 15,
        title: "Spider-Man: Brand New Day",
        rating : "PG",
        genre: "Action",
        language: "English",
        subtitles: "English",
        duration: "2h 30m",
        poster: "images/coming soon/spiderman.png",
        status: "coming-soon",
        
        synopsis: "A thrilling action-packed film with stunning visuals and an engaging storyline.",
        director: "Renee Ong",
        cast: "Zi Yang, Priscilla, Arden",
        releaseDate: "15 March 2025"
    },
]