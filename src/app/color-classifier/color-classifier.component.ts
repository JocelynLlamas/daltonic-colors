import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-color-classifier',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './color-classifier.component.html',
  styleUrls: ['./color-classifier.component.css'],
})
export class ColorClassifierComponent {
  colorResult: Array<{ color: string }> = [];
  imagePreview: string | ArrayBuffer | null = '';
  originalImage: string | ArrayBuffer | null = ''; // Imagen original sin filtros
  filterType: string = ''; // Tipo de filtro actual
  filterDescription: string = ''; // Descripción del filtro actual

  constructor() { }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result || '';
        this.originalImage = this.imagePreview; // Guarda la imagen original
        setTimeout(() => this.classifyColors(), 100);
      };
      reader.readAsDataURL(file);
    }
  }

  applyFilter(filter: string) {
    if (filter === '') {
      // Si el filtro es "original", restauramos la imagen original
      this.imagePreview = this.originalImage;
      this.filterType = '';
      this.filterDescription = ''; // Eliminamos la descripción
      return;
    }

    // Actualizamos el filtro seleccionado y la descripción correspondiente
    this.filterType = filter;
    this.imagePreview = this.originalImage; // Restaura la imagen original antes de aplicar el filtro

    // Establecemos la descripción basada en el filtro seleccionado
    switch (filter) {
      case 'protanopia':
        this.filterDescription = 'Protanopia: Deficiencia para percibir el color rojo. Las personas con protanopia tienen dificultad para distinguir entre tonos de rojo y verde.';
        break;
      case 'deuteranopia':
        this.filterDescription = 'Deuteranopia: Deficiencia para percibir el color verde. Las personas con deuteranopia tienen dificultad para distinguir entre tonos de rojo y verde.';
        break;
      case 'tritanopia':
        this.filterDescription = 'Tritanopia: Deficiencia para percibir el color azul. Las personas con tritanopia tienen dificultad para distinguir entre tonos de azul y amarillo.';
        break;
    }

    setTimeout(() => this.applyDaltonismFilter(), 100);
  }

  applyDaltonismFilter() {
    const img = new Image();
    img.src = this.originalImage as string; // Usa siempre la imagen original
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context?.drawImage(img, 0, 0);

      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return;

      const data = imageData.data;

      // Aplica el filtro seleccionado
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

        let [newR, newG, newB] = [r, g, b];
        if (this.filterType === 'protanopia') {
          [newR, newG, newB] = this.protanopia(r, g, b);
        } else if (this.filterType === 'deuteranopia') {
          [newR, newG, newB] = this.deuteranopia(r, g, b);
        } else if (this.filterType === 'tritanopia') {
          [newR, newG, newB] = this.tritanopia(r, g, b);
        }

        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
      }

      // Actualiza el canvas con los datos filtrados
      context!.putImageData(imageData, 0, 0);

      // Actualiza la vista previa de la imagen filtrada
      this.imagePreview = canvas.toDataURL();
    };
  }

  protanopia(r: number, g: number, b: number): [number, number, number] {
    return [
      0.56667 * r + 0.43333 * g,
      0.55833 * g + 0.44167 * b,
      0.24167 * r + 0.75833 * b,
    ].map(Math.round) as [number, number, number];
  }

  deuteranopia(r: number, g: number, b: number): [number, number, number] {
    return [
      0.625 * r + 0.375 * g,
      0.7 * g + 0.3 * b,
      0.3 * r + 0.7 * b,
    ].map(Math.round) as [number, number, number];
  }

  tritanopia(r: number, g: number, b: number): [number, number, number] {
    return [
      0.95 * r + 0.05 * g,
      0.43333 * g + 0.56667 * b,
      0.475 * r + 0.525 * b,
    ].map(Math.round) as [number, number, number];
  }

  classifyColors() {
    const img = new Image();
    img.src = this.imagePreview as string;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context?.drawImage(img, 0, 0);

      const data = context?.getImageData(0, 0, canvas.width, canvas.height).data;
      if (!data) return;

      const colorCounts: { [key: string]: number } = {};
      for (let i = 0; i < data.length; i += 4) {
        const rgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
        colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
      }

      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([rgb]) => ({
          color: `rgb(${rgb})`
        }));

      this.colorResult = sortedColors;
    };
  }
}
