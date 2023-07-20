import {render, screen} from '@testing-library/react';
import App from './app';

test('has message editor button', () => {
    render(<App/>);

    const linkElement = screen.getByText(/Message Editor/i);

    expect(linkElement).toBeInTheDocument();
});
