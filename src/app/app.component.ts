import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PositionDot } from './fingerboard/position-dot';
import { scaleByType } from '../core/scale-list';
import { allScaleTypes, ScaleType } from '../core/scale-type';
import { allSounds, Sound } from '../core/sound';

@Component({
  selector: 'gsp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  fretMark = true;

  root = Sound.C;

  scaleType = ScaleType.Major;

  dots: PositionDot[] = this.getDots();

  allSounds = allSounds();

  allScaleTypes = allScaleTypes();

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  soundName(sound: Sound) {
    return Sound[sound];
  }

  scaleName(scale: ScaleType) {
    return ScaleType[scale];
  }

  private getDots() {
    const scale = scaleByType(this.scaleType);
    const strings = [Sound.E, Sound.B, Sound.G, Sound.D, Sound.A, Sound.E];
    return scale.reduce((carry, scaleIndex) => {
      const dots: PositionDot[] = strings.reduce((_carry, stringSound, string) => {
        const frets = this.fretsFor((this.root + scaleIndex) % 12, stringSound);
        const _dots = frets.map(fret => {
          return {fret, string: string + 1, color: scaleIndex === 0 ? 'red' : undefined};
        });
        return _carry.concat(_dots);
      }, []);
      return carry.concat(dots);
    }, []);
  }

  private fretsFor(sound: Sound, onStringSound: Sound, maxFret: number = 21) {
    const minFret = (sound - onStringSound + 12) % 12;
    const frets = [minFret];
    while (true) {
      const prev = frets[frets.length - 1];
      if (prev + 12 > maxFret) {
        break;
      }
      frets.push(prev + 12);
    }

    return frets;
  }

  toggleMark() {
    this.fretMark = !this.fretMark;
    this.changeDetector.markForCheck();
  }

  onRootChange(e: Event) {
    this.root = Sound[Sound[(e.target as any).value]];
    this.dots = this.getDots();
    this.changeDetector.markForCheck();
  }

  onScaleTypeChange(e: Event) {
    this.scaleType = ScaleType[ScaleType[(e.target as any).value]];
    this.dots = this.getDots();
    this.changeDetector.markForCheck();
  }
}
