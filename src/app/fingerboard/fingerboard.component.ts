import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { PositionDot, validateDot } from './position-dot';
import { Note, noteName } from '../../core/note';

export type D3Selection = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

const arithmeticSequence = (initial: number, interval: number, limit: number): number[] => {
  const sequence = [];
  for (let i = 0; true; i++) {
    const next = interval * i + initial;
    if (next > limit) {
      break;
    }
    sequence.push(next);
  }
  return sequence;
};

@Component({
  selector: 'gsp-fingerboard',
  templateUrl: './fingerboard.component.html',
  styleUrls: ['./fingerboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FingerboardComponent implements OnInit, OnChanges {

  @Input()
  fretMark = true;

  @Input()
  stringName = true;

  @Input()
  numberOfFrets = 21;

  @Input()
  dots: PositionDot[] = [];

  @Input()
  strings: Note[] = [];

  get numberOfStrings() {
    return this.strings.length;
  }

  @ViewChild('svg')
  private svgElement: ElementRef;

  private $svg: D3Selection;

  private $dots: D3Selection;

  private $frets: D3Selection;

  private $strings: D3Selection;

  private $fretMarks: D3Selection;

  private $stringNames: D3Selection;

  ngOnInit() {
    this.$svg = d3.select(this.svgElement.nativeElement);
    this.renderFretMarks();
    this.renderFrets();
    this.renderStrings();
    this.renderStringNames();
    this.renderDots();
  }

  ngOnChanges(changes: SimpleChanges) {
    const numberOfFretsChanged = changes.numberOfFrets && !changes.numberOfFrets.firstChange;
    const stringsChanged = changes.strings && !changes.strings.firstChange;
    const dotsChanged = changes.dots && !changes.dots.firstChange;
    const fretMarkChagned = changes.fretMark && !changes.fretMark.firstChange;
    const stringNameChanged = changes.stringName && !changes.stringName.firstChange;

    if (numberOfFretsChanged) {
      this.renderFretMarks();
      this.renderFrets();
    }

    if (stringsChanged || numberOfFretsChanged) {
      this.renderStrings();
    }

    if (stringsChanged) {
      this.renderStringNames();
    }

    if (numberOfFretsChanged || dotsChanged || stringsChanged) {
      this.renderDots();
    }

    if (fretMarkChagned) {
      this.toggleFretMarks();
    }

    if (stringNameChanged) {
      this.toggleStringNames();
    }
  }

  private renderStringNames() {
    if (this.$stringNames) {
      this.$stringNames.selectAll('*').remove();
    } else {
      this.$stringNames = this.$svg.append('g').attr('class', 'string-names');
    }

    this.strings.forEach((string, i) => {
      const y = 100 * i / (this.numberOfStrings - 1) + '%';
      this.$stringNames.append('text')
        .attr('class', `string-name string-name-${i + 1}`)
        .text(noteName(string))
        .attr('x', 0)
        .attr('y', y)
        .attr('dominant-baseline', 'central');
    });

    this.toggleStringNames();
  }

  private toggleStringNames() {
    this.$stringNames.style('display', this.stringName ? 'inherit' : 'none');
  }

  private renderDots() {
    if (this.$dots) {
      this.$dots.selectAll('*').remove();
    } else {
      this.$dots = this.$svg.append('g').attr('class', 'dots');
    }
    this.dots.forEach(this.renderDot.bind(this));
  }

  private renderDot(dot: PositionDot) {
    validateDot(dot);
    if (dot.string > this.numberOfStrings || dot.fret > this.numberOfFrets) {
      return;
    }
    const x = (dot.fret + 0.5) * 99 / (this.numberOfFrets + 1) + '%';
    const y = 100 * (dot.string - 1) / (this.numberOfStrings - 1) + '%';
    this.$dots.append('circle')
      .attr('class', `dot dot-${dot.string}s dot-${dot.fret}f`)
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 10)
      .attr('fill', dot.color)
      .style('opacity', dot.opacity);
    if (dot.text) {
      this.$dots.append('text')
        .attr('class', `dot-text dot-text-${dot.string}s dot-text-${dot.fret}f`)
        .text(dot.text)
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', dot.textColor || 'white');
    }
  }

  private renderFretMarks() {
    if (this.$fretMarks) {
      this.$fretMarks.selectAll('*').remove();
    } else {
      this.$fretMarks = this.$svg.append('g').attr('class', 'fret-marks');
    }

    const fretsToMark = [3, 5, 7, 9, 12].reduce((carry, v) => {
      return carry.concat(arithmeticSequence(v, 12, this.numberOfFrets));
    }, []);

    fretsToMark.forEach(fret => {
      const isDouble = fret % 12 === 0;
      const x = (fret + 0.5) * 99 / (this.numberOfFrets + 1) + '%';
      if (isDouble) {
        this.$fretMarks.append('circle')
          .attr('class', `fret-mark fret-mark-double fret-mark-${fret} fret-mark-${fret}-1`)
          .attr('cx', x).attr('r', 10)
          .attr('cy', '25%');
        this.$fretMarks.append('circle')
          .attr('class', `fret-mark fret-mark-double fret-mark-${fret} fret-mark-${fret}-2`)
          .attr('cx', x).attr('r', 10)
          .attr('cy', '75%');
      } else {
        this.$fretMarks.append('circle')
          .attr('class', `fret-mark fret-mark-single fret-mark-${fret}`)
          .attr('cx', x).attr('r', 10)
          .attr('cy', '50%');
      }
    });

    this.toggleFretMarks();
  }

  private toggleFretMarks() {
    this.$fretMarks.style('display', this.fretMark ? 'inherit' : 'none');
  }

  private renderFrets() {
    if (this.$frets) {
      this.$frets.selectAll('*').remove();
    } else {
      this.$frets = this.$svg.append('g').attr('class', 'frets');
    }

    Array(this.numberOfFrets + 1).fill(0).forEach((_, i) => {
      const x = 99 * (i + 1) / (this.numberOfFrets + 1) + '%';
      const isNut = i === 0;
      const $fret = this.$frets.append('line')
        .attr('class', `fret fret-${i}`)
        .attr('stroke-width', isNut ? 6 : 2)
        .attr('stroke', 'black')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', isNut ? '-1%' : 0)
        .attr('y2', isNut ? '101%' : '100%');
      if (isNut) {
        $fret
          .style('transform', 'translate(-2px, 0)')
          .attr('transform', 'translate(-2, 0)');
      }
    });
  }

  private renderStrings() {
    if (this.$strings) {
      this.$strings.selectAll('*').remove();
    } else {
      this.$strings = this.$svg.append('g').attr('class', 'strings');
    }

    Array(this.numberOfStrings).fill(0).forEach((_, i) => {
      const x = 99 / (this.numberOfFrets + 1) + '%';
      const y = 100 * i / (this.numberOfStrings - 1) + '%';
      this.$strings.append('line')
        .attr('class', `string string-${i + 1}`)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('x1', x)
        .attr('x2', '100%')
        .attr('y1', y)
        .attr('y2', y);
    });
  }

}
