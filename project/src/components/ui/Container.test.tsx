import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container Component', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <span>Test Content</span>
      </Container>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies the container CSS class by default', () => {
    const { container } = render(
      <Container>
        <p>Inside Container</p>
      </Container>
    );
    const div = container.firstElementChild;
    expect(div).toHaveClass('container');
  });

  it('applies additional className passed via props', () => {
    const { container } = render(
      <Container className="custom-wrapper my-custom-class">
        <p>Custom classes</p>
      </Container>
    );
    const div = container.firstElementChild;
    expect(div).toHaveClass('container');
    expect(div).toHaveClass('custom-wrapper');
    expect(div).toHaveClass('my-custom-class');
  });

  it('supports rendering as a custom HTML element like section, main, or header', () => {
    const { container } = render(
      <Container as="section" data-testid="custom-section">
        <h2>Section Heading</h2>
      </Container>
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container');
    expect(section?.tagName.toLowerCase()).toBe('section');
  });
});
