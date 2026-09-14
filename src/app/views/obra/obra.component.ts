import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-obra',
  imports: [ChartModule],
  templateUrl: './obra.component.html',
  styleUrl: './obra.component.scss',
})
export class ObraComponent {

  data: any;
  options: any;
   private observer!: MutationObserver;
  ngAfterViewInit() {
    this.createChart();

    this.observer = new MutationObserver(() => {
      this.createChart();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private createChart() {

    const styles = getComputedStyle(document.documentElement);

    const textColor =
      styles.getPropertyValue('--p-text-color').trim();

    const borderColor =
      styles.getPropertyValue('--p-content-border-color').trim();

    this.data = {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio'
      ],
      datasets: [
        {
          label: 'Ingresos',
          data: [12000, 19000, 15000, 22000, 18000, 25000]
        }
      ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: textColor
          },
         
        },

        y: {
          ticks: {
            color: textColor
          },
         
        }
      }
    };
  }
    ngOnDestroy() {
    this.observer?.disconnect();
  }


}
