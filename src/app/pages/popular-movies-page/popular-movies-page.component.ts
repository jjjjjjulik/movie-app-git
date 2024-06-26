import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterLink, RouterModule } from '@angular/router';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { MovieService } from '../../services/movie/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-popular-movies-page',
  standalone: true,
  templateUrl: './popular-movies-page.component.html',
  styleUrls: ['./popular-movies-page.component.scss'],
  imports: [HeaderComponent, RouterLink, RouterModule, MovieListComponent],
})
export class PopularMoviesPageComponent implements OnInit {
  popularMovies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.popularMovies = this.movieService.getPopularMovies();
  }
}
