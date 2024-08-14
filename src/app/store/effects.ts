import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as MovieActions from './actions';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { MovieService } from '../services/movie/movie.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class MovieEffects {
  loadPopularMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadPopularMovies),
      concatMap(() =>
        this.movieService.getPopularMovies().pipe(
          map((movies) =>
            MovieActions.loadPopularMoviesSuccess({ movies: movies.results })
          ),
          catchError((error) =>
            of(MovieActions.loadPopularMoviesFailure({ error }))
          )
        )
      )
    )
  );

  loadNowPlayingMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadNowPlayingMovies),
      concatMap(() =>
        this.movieService.getNowPlayingMovies().pipe(
          map((movies) =>
            MovieActions.loadNowPlayingMoviesSuccess({ movies: movies.results })
          ),
          catchError((error) =>
            of(MovieActions.loadNowPlayingMoviesFailure({ error }))
          )
        )
      )
    )
  );

  loadTopRatedMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadTopRatedMovies),
      concatMap(() =>
        this.movieService.getTopRatedMovies().pipe(
          map((movies) =>
            MovieActions.loadTopRatedMoviesSuccess({ movies: movies.results })
          ),
          catchError((error) =>
            of(MovieActions.loadTopRatedMoviesFailure({ error }))
          )
        )
      )
    )
  );

  loadUpcomingMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadUpcomingMovies),
      concatMap(() =>
        this.movieService.getUpcomingMovies().pipe(
          map((movies) =>
            MovieActions.loadUpcomingMoviesSuccess({ movies: movies.results })
          ),
          catchError((error) =>
            of(MovieActions.loadUpcomingMoviesFailure({ error }))
          )
        )
      )
    )
  );

  loadMovieDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadMovieDetails),
      concatMap((action) =>
        this.movieService.getMovieDetails(action.movieId).pipe(
          map((movie) => MovieActions.loadMovieDetailsSuccess({ movie })),
          catchError((error) =>
            of(MovieActions.loadMovieDetailsFailure({ error }))
          )
        )
      )
    )
  );

  loadFavouriteMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadFavouriteMovies),
      mergeMap(() =>
        this.movieService.getFavouriteMovies().pipe(
          map((movies) => MovieActions.loadFavouriteMoviesSuccess({ movies })),
          catchError((error) =>
            of(MovieActions.loadFavouriteMoviesFailure({ error }))
          )
        )
      )
    )
  );

  loadWatchListMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadWatchListMovies),
      mergeMap(() =>
        this.movieService.getWatchListMovies().pipe(
          map((movies) => MovieActions.loadWatchListMoviesSuccess({ movies })),
          catchError((error) =>
            of(MovieActions.loadWatchListMoviesFailure({ error }))
          )
        )
      )
    )
  );

  setMovieToFavourites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.setMovieToFavourites),
      mergeMap((action) =>
        this.movieService.updateList('favorite', action.movieId, true).pipe(
          map(() => MovieActions.loadFavouriteMovies()),
          catchError((error) =>
            of(MovieActions.loadFavouriteMoviesFailure({ error }))
          )
        )
      )
    )
  );

  removeMovieFromFavourites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.removeMovieFromFavourites),
      mergeMap((action) =>
        this.movieService.updateList('favorite', action.movieId, false).pipe(
          map(() => MovieActions.loadFavouriteMovies()),
          catchError((error) =>
            of(MovieActions.loadFavouriteMoviesFailure({ error }))
          )
        )
      )
    )
  );

  setMovieToWatchList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.setMovieToWatchList),
      mergeMap((action) =>
        this.movieService.updateList('watchlist', action.movieId, true).pipe(
          map(() => MovieActions.loadWatchListMovies()),
          catchError((error) =>
            of(MovieActions.loadWatchListMoviesFailure({ error }))
          )
        )
      )
    )
  );

  removeMovieFromWatchList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.removeMovieFromWatchList),
      mergeMap((action) =>
        this.movieService.updateList('watchlist', action.movieId, false).pipe(
          map(() => MovieActions.loadWatchListMovies()),
          catchError((error) =>
            of(MovieActions.loadWatchListMoviesFailure({ error }))
          )
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.login),
      mergeMap(({ username, password }) =>
        this.authService.getRequestToken().pipe(
          switchMap((tokenResponse) =>
            this.authService
              .askForPermission(username, password, tokenResponse.request_token)
              .pipe(
                switchMap(() =>
                  this.authService
                    .createSessionId(tokenResponse.request_token)
                    .pipe(
                      map((sessionResponse) => {
                        const sessionId = sessionResponse.session_id;
                        this.authService.setSessionId(sessionId);
                        return MovieActions.loginSuccess({ sessionId });
                      })
                    )
                )
              )
          ),
          catchError((error) =>
            of(MovieActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loginSuccess),
      tap(({ redirectUrl }) => {
        if (redirectUrl) {
          this.router.navigate([redirectUrl]);
        }
      }),
      map(() => MovieActions.closeLoginPopup())
    )
  );

  searchMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.searchMovies),
      switchMap(({ query }) =>
        this.movieService.searchMovies(query).pipe(
          map((movies) => MovieActions.searchMoviesSuccess({ movies })),
          catchError((error) =>
            of(MovieActions.searchMoviesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadGenres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadGenres),
      mergeMap(() =>
        this.movieService.getGenres().pipe(
          map((response) =>
            MovieActions.loadGenresSuccess({ genres: response.genres })
          ),
          catchError((error) => of(MovieActions.loadGenresFailure({ error })))
        )
      )
    )
  );

  loadMoviesByGenres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadMoviesByGenres),
      mergeMap((action) =>
        this.movieService.getMoviesByGenres(action.genres).pipe(
          map((response) =>
            MovieActions.loadMoviesByGenresSuccess({ movies: response.results })
          ),
          catchError((error) =>
            of(MovieActions.loadMoviesByGenresFailure({ error }))
          )
        )
      )
    )
  );

  loadMoviesByRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadMoviesByRating),
      switchMap(({ rating }) =>
        this.movieService.getMoviesByRating(rating).pipe(
          map((response) =>
            MovieActions.loadMoviesByRatingSuccess({ movies: response.results })
          ),
          catchError((error) =>
            of(MovieActions.loadMoviesByRatingFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}
}
