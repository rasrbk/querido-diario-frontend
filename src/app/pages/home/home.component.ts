import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, EMPTY } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { VideoModalComponent } from 'src/app/components/video-modal/video-modal.component';
import { City } from 'src/app/interfaces/city';
import { CitiesService } from 'src/app/services/cities.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  termControl = new FormControl();
  options: string[] = [
    'Compra emergencial COVID-19',
    'Dispensa de licitação',
    'Contratação',
    'Nomeação',
    'Saneamento básico',
  ];

  filteredOptions: Observable<string[]> = new Observable();

  cityControl = new FormControl();

  filteredCities: Observable<City[]> = new Observable();

  constructor(
    private citiesService: CitiesService,
    private modal: MatDialog,
    ) { }

  ngOnInit() {
    this.filteredOptions = this.termControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.filteredCities = this.cityControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(value => {
          if (value !== '') {
            return this._filterCity(value)
          } else {
            return of([])
          }
        })
      );
  }

  openVideo(): void {
    this.modal.open(VideoModalComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterCity(value: string): Observable<City[]> {
    const filterValue = value.toLowerCase();
    return this.citiesService.findByName(filterValue)
      .pipe(
        map((result) => result)
      )
  }

}
