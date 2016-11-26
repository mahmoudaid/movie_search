/*
* Author: Mahmoud Eid.
* Description: A Movie Search App with the OMDb API.
* Browsers the project was checked: Google Chrome, Mozilla Firefox, Safari.
*/

(function () {
	/*globals $:false */
	'use strict';

	/*
	* On submit search form
	* Search with search value and year
	* On IMDB API and print results.
	*/
	$('form').submit(function (event) {
		event.preventDefault();
		var searchValue = $('#search').val();
		var yearValue = $('#year').val();
		

		// Get search results from IMDB json format.
		$.getJSON(
			'http://www.omdbapi.com',
		 	{
		 		s: searchValue,
		 		y: yearValue,
		 		r: "json"
		 	},
		 	function (data) {
		 		// Empty movies list
				$('#movies').empty();
				// Show movies list if user search from description page.
				$('#movies').show();
				// Remove previous movie description page
				$('.description-page').remove();

		 		// Check if response is true print results.
		 		if(data.Response === 'True'){
		 			$.each(data.Search, function(i, movie) {
				    	// Prepare movie html
						var $movieLi = '<li data-imdbID="'+movie.imdbID+'">';
						$movieLi += '<div class="poster-wrap">';
						$movieLi += '<a href="http://www.imdb.com/title/'+movie.imdbID+'">';
						// Check if movie poster is available print it else print default icon.
						if(movie.Poster !== 'N/A'){
							$movieLi += '<img class="movie-poster" src="'+movie.Poster+'">';
						}else{
							$movieLi += '<i class="material-icons poster-placeholder">crop_original</i>';
						}
						$movieLi += '</a>';
						$movieLi += '</div>';
						$movieLi += '<span class="movie-title">'+movie.Title+'</span>';
						$movieLi += '<span class="movie-year">'+movie.Year+'</span>';
						$movieLi += '</li>';
						// append movie to movies list
						$('#movies').append($movieLi);
					});
		 			// Listen for click on li
					listenForMovieClick();
		 		}else if(data.Response === 'False'){
		 			// Else if response equal false show "No movies fount that match ....."
		 			var $noMovies = '<li class="no-movies">';
	            	$noMovies += '<i class="material-icons icon-help">help_outline</i>';
	            	$noMovies += 'No movies found that match: '+searchValue+'.';
	          		$noMovies += '</li>';
		 			$('#movies').html($noMovies);
		 		}
		});
	});

	/*
	* On click movie from movies list
	* Get the all information about this movie 
	* From IMDB by movie ID.
	*/
	function listenForMovieClick() {
		$('li').click(function() {
			var $mainContent = $('.main-content');
			var imdbID = $(this).attr("data-imdbID");
			
			// Get movie details by search in IMDB by IMDB ID
			$.getJSON(
				'http://www.omdbapi.com',
			 	{
			 		i: imdbID,
			 		r: "json"
			 	},
			 	function (movie) {
			 		// Hide movies list.
	 		$('#movies').hide();
	 		// Remove any previous movie description page
	 		$('.description-page').remove();
	 		
			 		// Check if movie response is True
			 		if(movie.Response === 'True'){
			 			// Prepare description page HTML.
						var $pageHead = '<div class="description-page page-head">';
						$pageHead += '<div class="inner">';
						$pageHead +='<div class="back-to-results">'; 
						$pageHead +='< Search results'; 
						$pageHead +='</div>';
						$pageHead +='<div class="description-movie-poster">';
						// Check if movie poster is available print it else print default icon.
						if(movie.Poster !== 'N/A'){
							$pageHead += '<img src="'+movie.Poster+'">';
						}else{
							$pageHead += '<i class="material-icons poster-placeholder">crop_original</i>';
						}
						$pageHead +='</div>';
						$pageHead += '<h1 class="description-page-title">'+movie.Title+' ('+movie.Year+')</h1>';
						$pageHead += '<div class="rate">IMDB Rating: '+movie.imdbRating+'</div>';
						$pageHead +='</div>';
						$pageHead +='</div>';

						var $pageBody = '<div class="inner description-page page-body">';
						$pageBody += '<b>Plot synopsis:</b>';
						$pageBody += '<br>';
						$pageBody += movie.Plot;
						$pageBody += '<br>';
						$pageBody += '<a class="imdb-movie-link" href="http://www.imdb.com/title/'+movie.imdbID+'">View on IMDB</a>';
						$pageBody += '</div>';

						// Add description page HTML after main-content class.
						var descriptionPageContent = $pageHead + $pageBody;
						$mainContent.after(descriptionPageContent);

						// Click back to search results
						$('.back-to-results').click(function() {
							$('#movies').show();
							$('.description-page').remove();
						});
					}
				});
		});
	}
}());