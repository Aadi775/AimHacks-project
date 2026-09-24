'use client';

import { Component, ReactNode } from 'react';

interface MapBoundaryProps {
  onError: () => void;
  children: ReactNode;
}

/**
 * Self-healing boundary for Leaflet's "Map container is already initialized"
 * crash. When React remounts the map onto a DOM node that still carries a
 * stale _leaflet_id (Suspense reveals, Fast Refresh), this catches the error,
 * reports it, and renders null — the parent then bumps a `key` which forces a
 * completely fresh container div and a clean re-init.
 */
export default class MapBoundary extends Component<MapBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: Error) {
    // Only trigger recovery for the Leaflet init race; rethrow others
    if (String(err).includes('already initialized') || String(err).includes('_leaflet_id')) {
      this.props.onError();
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
