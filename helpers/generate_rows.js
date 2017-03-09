import uuid from 'uuid';
import { sample, range } from 'lodash';
import schema2object from 'schema2object';
import generators from 'annogenerate';

const generate = schema2object.properties2object;

const adjectives = ['Super', 'Hyper', 'Awesome', 'Lame', 'Standard'];
const forenames = [
  'Jack', 'Bo', 'John', 'Jill', 'Angus', 'Janet', 'Cecilia',
  'Daniel', 'Marge', 'Homer', 'Trevor', 'Fiona', 'Margaret', 'Ofelia',
  'Mike', 'Don', 'Dirk', 'Greg', 'Arthur', 'Ike', 'Robert', 'Ulrich'
];
const surnames = [
  'MacGyver', 'Johnson', 'Jackson', 'Robertson', 'Hull', 'Hill', 'Simpson',
  'Ikesen', 'Cruise', 'Schwarz', 'Xu', 'Li', 'Lee', 'White', 'Brown'
];

const generateRows = (amount, { definitions, properties }) => range(amount).map(
  () => generate({
    generators,
    fieldGenerators: {
      placa() {
        return uuid.v4();
      },
      Id() {
        return uuid.v4();
      },
      modelo() {
        return {
          name: this.name()
        };
      },
      name() {
        return `${sample(forenames)} ${sample(surnames)}`;
      },
      fullName() {
        return {
          first: sample(forenames), last: sample(surnames)
        };
      },
      company() {
        const first = ['App', 'No', 'Micro', 'Ora', 'Sun', 'Soft', 'Accen', 'Syman'];
        const second = [
          'le', 'kia', 'soft', 'cle', 'ice',
          'ify', 'ture', 'tec', 'ware', ' Solutions'
        ];
        const third = ['Ltd.', 'Inc.'];

        return `${sample(first)}${sample(second)} ${sample(third)}`;
      },
      product() {
        const modelo = ['Apple', 'Pear', 'Strawberry', 'Pineapple', 'Potato', 'Tomato'];

        return `${sample(adjectives)} ${sample(names)}`;
      },
      position() {
        return (['one', 'two', 'three']);
      },
      address() {
        const suffixes = ['street', 'road', ' Road', ' Street', 'ton', ' Village', ''];
        const number = generators.number(1, 2000);

        return `${sample(adjectives)}${sample(suffixes)} ${number}`;
      },
      active() {
        return sample([true, false]);
      }
    },
    properties,
    definitions
  })
);

export default generateRows;