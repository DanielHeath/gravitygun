function cmpNum(a, b) {
  return (a > b ? 1 : (a < b ? -1 : 0))
}
function randNormal() {
  return Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
}
const defaultDeviations = 2
function clampedRandNormal(deviations=defaultDeviations) {
  let result = randNormal()
  if (result > deviations) result = deviations
  if (result < -deviations) result = - deviations
  return result
}

function randNormalDist(mean, stddev) {
  return clampedRandNormal() * stddev + mean;
}

function distance(object, other) {
  // if (window.stopping && object.color == 'red' && (Math.abs(other.position.y - object.position.y) < 550) && (Math.abs(other.position.x - object.position.x) < 550)) {
  //   debugger
  // }
  const radiuss = (object.radius || 0) + (other.radius || 0)

  if (object.position) {
    object = object.position
  }
  if (other.position) {
    other = other.position
  }

  return Math.sqrt((object.x - other.x)**2 + (object.y - other.y)**2) - radiuss
}

function dotproduct(vel1, vel2) {
  return (vel1.x * vel2.x) + (vel1.y * vel2.y)
}
function mulVec(scalar, vector) {
  return {
    x: vector.x*scalar,
    y: vector.y*scalar
  }
}
function addVec(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  }
}

function collisionVelocities(m1, m2, u1, u2) {
  const v1 = addVec(mulVec((m1 - m2)/(m1+m2), u1), mulVec((2*m2)/(m1+m2), u2))
  const v2 = addVec(mulVec((m2 - m1)/(m2+m1), u2), mulVec((2*m1)/(m2+m1), u1))
  return {v1, v2}
}