export type Shot = { w: number; h: number; transparent: boolean };

let shoot: ((shot: Shot) => void) | null = null;

export function registerCapture(fn: (shot: Shot) => void) {
  shoot = fn;
  return () => {
    if (shoot === fn) shoot = null;
  };
}

export function takePhoto(shot: Shot) {
  if (!shoot) return false;
  shoot(shot);
  return true;
}
