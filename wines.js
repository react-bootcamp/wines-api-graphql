
const fetch = require('node-fetch');

const rootUrl = 'https://wines-api.herokuapp.com/api';

function getRegions(args = {}) {
  const url = `${rootUrl}/regions`;
  console.log(`GET ${url}`);
  return fetch(url)
    .then(r => r.json())
    .then(regions => regions.map(r => ({ id: r })))
    .then(regions => {
      if (args.first) {
        return regions.slice(0, args.first);
      } else if (args.last) {
        return regions.slice(regions.length - args.last, regions.length);
      } else if (args.ids) {
        return regions.filter(r => args.ids.indexOf(r.id) > -1);
      } else {
        return regions;
      }
    });
}

function getWines(args = {}) {
  return getRegions()
    .then(regions => args.fromRegions ? regions.filter(r => args.fromRegions.indexOf(r.id) > -1) : regions)
    .then(regions => Promise.all(regions.map(r => getWinesFromRegion(r)))).then(r => {
      return r.reduce((a, b) => a.concat(b), []);
    }).then(wines => {
      if (args.first) {
        return wines.slice(0, args.first);
      } else if (args.last) {
        return wines.slice(wines.length - args.last, wines.length);
      } else if (args.ids) {
        return wines.filter(r => args.ids.indexOf(r.id) > -1);
      } else {
        return wines;
      }
    });
}

function getWinesFromRegion(region, args = {}) {
  const url = `${rootUrl}/wines?region=${region.id}`;
  console.log(`GET ${url}`);
  return fetch(url).then(r => r.json()).then(wines => {
    if (args.first) {
      return wines.slice(0, args.first);
    } else if (args.last) {
      return wines.slice(wines.length - args.last, wines.length);
    } else if (args.ids) {
      return wines.filter(r => args.ids.indexOf(r.id) > -1);
    } else {
      return wines;
    }
  });
}

function getImage(wine) {
  return Promise.resolve({ url: `${rootUrl}/wines/${wine.id}/image` });
}

function getComments(wine, args = {}) {
  const url = `${rootUrl}/wines/${wine.id}/comments`;
  console.log(`GET ${url}`);
  return fetch(url).then(r => r.json()).then(comments => {
    if (args.first) {
      return comments.slice(0, args.first);
    } else if (args.last) {
      return comments.slice(comments.length - args.last, comments.length);
    } else {
      return comments;
    }
  });
}

function getLike(wine) {
  const url = `${rootUrl}/wines/${wine.id}/like`;
  console.log(`GET ${url}`);
  return fetch(url).then(r => r.json()).then(r => r.like);
}

function getRegion(id) {
  return Promise.resolve({ id });
}

function getWine(id) {
  const url = `${rootUrl}/wines/${id}`;
  console.log(`GET ${url}`);
  return fetch(url).then(r => r.json());
}

exports.getRegions = getRegions;
exports.getWines = getWines;
exports.getWinesFromRegion = getWinesFromRegion;
exports.getImage = getImage;
exports.getComments = getComments;
exports.getLike = getLike;
exports.getRegion = getRegion;
exports.getWine = getWine;
