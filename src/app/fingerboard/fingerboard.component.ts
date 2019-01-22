import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

export type D3Selection = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

const NUMBER_OF_STRINGS = 6;
const NUMBER_OF_FRETS = 21;

@Component({
  selector: 'gsp-fingerboard',
  templateUrl: './fingerboard.component.html',
  styleUrls: ['./fingerboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FingerboardComponent implements OnInit {

  @Input()
  fretMark = true;

  @Input()
  fretNumber = true;

  @ViewChild('svg')
  private svgElement: ElementRef;

  private $svg: D3Selection;

  constructor(private host: ElementRef) { }

  ngOnInit() {
    this.$svg = d3.select(this.svgElement.nativeElement);
    this.renderFrets();
    this.renderStrings();
  }

  private renderFrets() {
    const $frets = this.$svg.append('g').attr('class', 'frets');

    Array(NUMBER_OF_FRETS + 1).fill(0).forEach((_, i) => {
      const x = (100 - 1) * (i + 1) / (NUMBER_OF_FRETS + 1) + '%';
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
