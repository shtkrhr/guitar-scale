import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PositionDot } from './fingerboard/position-dot';
import { allScaleTypes, scaleByType, ScaleType } from '../core/scale-type';
import { allNotes, Note, noteName } from '../core/note';
import { allTuningTypes, stringsForTuning, TuningType } from '../core/tuning-type';
import { arithmeticSequence } from '../core/until';

@Component({
  selector: 'gsp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  root = Note.C;

  scaleType = ScaleType.Major;

  tuningType = TuningType.GuitarRegular;

  fretMark = true;

  numberOfFrets = 21;

  stringName = true;

  strings: Note[] = [];

  dots: PositionDot[] = [];

  allNotes = allNotes();

  allScaleTypes = allScaleTypes();

  allTuningTypes = allTuningTypes();

  constructor(private changeDetector: ChangeDetectorRef) {
    this.updateStrings();
    this.updatePositionDots();
  }

  ngOnInit() {
  }

  noteName(note: Note) {
    return noteName(note);
  }

  onRootChange() {
    this.updatePositionDots();
  }

  onScaleTypeChange() {
    this.updatePositionDots();
  }

  onTuningTypeChange() {
    this.updateStrings();
    this.updatePositionDots();
  }

  onNumberOfFretsChange() {
    this.updatePositionDots();
  }

  private updateStrings() {
    this.strings = stringsForTuning(this.tuningType);
  }

  private updatePositionDots() {
    const scale = scaleByType(this.scaleType);
    this.dots = scale.reduce((dots, scaleIndex) => {
      const note = (this.root + scaleIndex) % 12;
      const dotsForNote = this.strings.reduce((_carry, stringNote, stringIndex) => {
        return _carry.concat(
          this.fretsFor(note, stringNote, this.numberOfFrets)
            .map(fret => ({fret, string: stringIndex, color: scaleIndex === 0 ? '#ff4081' : '#212121'}))
        );
      }, []);
      return dots.concat(dotsForNote);
    }, []);
  }

  private fretsFor(note: Note, onStringNote: Note, maxFret: number = 21) {
    const minFret = (note - onStringNote + 12) % 12;

    return arithmeticSequence(minFret, 12, maxFret);
  }
}
