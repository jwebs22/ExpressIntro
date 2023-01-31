// Bring in Express code
const express = require('express')

const app = express()
const port = 3000

app.use(express.json()) // This line is necessary for Express to be able to parse JSON in request body's

//this is your data source that the routes below will be operating on.
const favoriteMovieList = [{
  title: "Star Wars",
  starRating: 5,
  isRecommended: true,
  createdAt: new Date(),
  lastModified: new Date()
}, {
  title: "The Avengers",
  starRating: 4,
  isRecommended: true,
  createdAt: new Date(),
  lastModified: new Date()
}];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Get All Movies GET --DONE Stretch Goals 2, Done.

app.get("/all-movies", (req, res)=>{

    console.log(req.query);
    const starRating = Number(req.query.starRating)
    console.log(starRating);

    if (starRating)
    {
    const filteredMoviesByStar = favoriteMovieList.filter((movie)=>
    {
        return movie.starRating >= starRating
    })

    console.log(filteredMoviesByStar);

	res.json({
		success: true,
		favoriteMovieList: filteredMoviesByStar
	})
    } else
    {
        res.json({
            success: true,
            favoriteMovieList: favoriteMovieList
        })

    }
})

//Get Single Movie GET --DONE
app.get("/single-movie/:title", (req, res)=>{
    console.log(req.params.title);
	const foundMovie = favoriteMovieList.find((movie)=>{
		return movie.title === req.params.title
	})

	res.json({
		success: true,
		foundMovie: foundMovie
	})
})

//Add New Movie POST --DONE. Stretch Goals: 1. DONE. 
app.post("/new-movie", (req, res)=>
{
    //Validation Code:
    if (req.body.title === undefined || typeof(req.body.title) !== "string") {
		res.json({
			success: false,
			message: "movie title is required and must be a string"
		})
		return
	}
    if (req.body.starRating === undefined || typeof(req.body.starRating) === "string" || req.body.starRating < 0 || req.body.starRating > 5) {
		res.json({
			success: false,
			message: "star rating is required and must be a number between 0 and 5"
		})
		return
	}
    if (req.body.isRecommended === undefined || typeof(req.body.isRecommended) !== "boolean" || typeof(req.body.isRecommended) !== "boolean") {
		res.json({
			success: false,
			message: "is Recommend is required and must be a either true or false"
		})
		return
	}
    //END validation code
	
    console.log(typeof(req.body.isRecommended));
    const newMovie = {}
    newMovie.title = req.body.title
    newMovie.starRating = req.body.starRating
    newMovie.isRecommended = req.body.isRecommended
    newMovie.createdAt = new Date()
    newMovie.lastModified = new Date()

    favoriteMovieList.push(newMovie)

    res.json({
        success: true
    })
})

//Update Movie PUT --DONE

app.put("/update-movie/:title", (req, res)=>
{
    const titleToUpdate = req.params.title

    const originalMovie = favoriteMovieList.find((movie)=>
    {
        return movie.title === titleToUpdate
    })

    const originalMovieIndex = favoriteMovieList.findIndex((movie)=>
    {
        return movie.title === titleToUpdate
    })

    if (!originalMovie)
    {
        res.json({
            success: false,
            message: "Could not find movie in movie list"
        })
        return
    }
    const updatedMovie = {}

    if (req.body.title !== undefined)
    {
        updatedMovie.title = req.body.title
    } else
    {
        updatedMovie.title = originalMovie.title
    }

    if (req.body.starRating !== undefined)
    {
        updatedMovie.starRating = req.body.starRating
    } else
    {
        updatedMovie.starRating = originalMovie.starRating
    }

    if (req.body.isRecommended !== undefined)
    {
        updatedMovie.isRecommended = req.body.isRecommended
    } else
    {
        updatedMovie.isRecommended = originalMovie.isRecommended
    }

    favoriteMovieList[originalMovieIndex] = updatedMovie

    res.json({
        success: true
    })
})

//DELETE --DONE
app.delete("/delete-movie/:title", (req, res)=>
{
    const movieToDelete = req.params.title

    const indexOfMovie = favoriteMovieList.findIndex((movie)=>
    {
        return movie.title === movieToDelete
    })

    favoriteMovieList.splice(indexOfMovie, 1)

    res.json({
        success: true
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

