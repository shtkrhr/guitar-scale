import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { PositionDot, validateDot } from './position-dot';

export type D3Selection = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

const NUMBER_OF_STRINGS = 6;
const NUMBER_OF_FRETS = 21;

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
  dots: PositionDot[] = [];

  @ViewChild('svg')
  private svgElement: ElementRef;

  private $svg: D3Selection;

  private $dots: D3Selection;

  private $fretMarks: D3Selection;

  constructor(private host: ElementRef) { }

  ngOnInit() {
    this.$svg = d3.select(this.svgElement.nativeElement);
    this.renderFretMarks();
    this.renderFrets();
    this.renderStrings();
    this.dots.forEach(this.renderDot.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dots && !changes.dots.firstChange) {
      if (this.$dots) {
        this.$dots.remove();
        this.$dots = undefined;
      }
      this.dots.forEach(this.renderDot.bind(this));
    }
    if (changes.fretMark && !changes.fretMark.firstChange) {
      this.toggleFretMarks();
    }
  }

  private renderDot(dot: PositionDot) {
    if (!this.$dots) {
      this.$dots = this.$svg.append('g').attr('class', 'dots');
    }
    validateDot(dot);
    const x = (dot.fret + 0.5) * 99 / (NUMBER_OF_FRETS + 1) + '%';
    const y = 100 * (dot.string - 1) / (NUMBER_OF_STRINGS - 1) + '%';
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
    this.$fretMarks = this.$svg.append('g').attr('class', 'fret-marks');

    [3, 5, 7, 9, 15, 17, 19, 21].forEach(fret => {
      const x = (fret + 0.5) * 99 / (NUMBER_OF_FRETS + 1) + '%';
      this.$fretMarks.append('circle')
        .attr('class', `fret-mark fret-mark-${fret}`)
        .attr('cx', x)
        .attr('cy', '50%')
        .attr('r', 10);
    });
    this.$fretMarks.append('circle')
      .attr('class', `fret-mark fret-mark-12 fret-mark-12-1`)
      .attr('cx', (12 + 0.5) * 99 / (NUMBER_OF_FRETS + 1) + '%')
      .attr('cy', '25%')
      .attr('r', 10);
    this.$fretMarks.append('circle')
      .attr('class', `fret-mark fret-mark-12 fret-mark-12-2`)
      .attr('cx', (12 + 0.5) * 99 / (NUMBER_OF_FRETS + 1) + '%')
      .attr('cy', '75%')
      .attr('r', 10);
    this.toggleFretMarks();
  }

  private toggleFretMarks() {
    this.$fretMarks.style('display', this.fretMark ? 'inherit' : 'none');
  }

  private renderFrets() {
    const $frets = this.$svg.append('g').attr('class', 'frets');

    Array(NUMBER_OF_FRETS + 1).fill(0).forEach((_, i) => {
      const x = 99 * (i + 1) / (NUMBER_OF_FRETS + 1) + '%';
      const isNut = i === 0;
      const $fret = $frets.append('line')
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
    const $strings = this.$svg.append('g').attr('class', 'strings');

    Array(NUMBER_OF_STRINGS).fill(0).forEach((_, i) => {
      const x = 100 / (NUMBER_OF_FRETS + 1) + '%';
      const y = 100 * i / (NUMBER_OF_STRINGS - 1) + '%';
      $strings.append('line')
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
