import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Character } from '../../core/character.model';
import { CharacterService } from '../characters.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  characters: Observable<Character[]>;
  isVisible = false;
  selectedCharacter: Character;
  showProgress = false;

  @ViewChild(MatDrawer) private drawer: MatDrawer;

  private searchTerms = new Subject<string>();
  public breakpoint = 0;

  constructor(private characterService: CharacterService) {}

  getCharacters() {
    const obsNoCharacters = of<Character[]>([]);

    this.characters = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term) {
          this.showProgress = true;
          return this.characterService.getCharacters(term);
        } else {
          return obsNoCharacters;
        }
      }),
      switchMap(heroes => {
        this.showProgress = false;
        return of(heroes);
      }),
      catchError(() => {
        this.showProgress = false;
        return obsNoCharacters;
      })
    );
  }

  ngOnInit() {
    this.getCharacters();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 4;
  }

  search(name: string) {
    this.searchTerms.next(name);
  }

  selectCharacter(character: Character) {
    this.selectedCharacter = character;
    this.drawer.toggle();
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 4;
  }

  trackByCharacters(index: number, character: Character) { return character.id; }
}
