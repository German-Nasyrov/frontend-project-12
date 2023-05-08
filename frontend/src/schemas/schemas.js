import * as yup from 'yup';
import filter from 'leo-profanity';

const channelNameSchema = (channels) => yup.object().shape({
  newChannelName: yup
    .string()
    .min(3, 'errors.symbolsLength')
    .max(20, 'errors.symbolsLength')
    .test('is-unique', 'errors.mustBeUnique', (newChannelName) => !channels.some((channel) => channel.name === newChannelName))
    .test('no-profanity', 'errors.profanity', (channelName) => !filter.check(channelName))
    .required('errors.requiredField'),
});

const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('signup.required')
    .min(3, 'signup.usernameConstraints')
    .max(20, 'signup.usernameConstraints'),
  password: yup
    .string()
    .trim()
    .required('signup.required')
    .min(6, 'signup.passMin'),
  confirmPassword: yup
    .string()
    .test('confirmPassword', 'signup.mustMatch', (value, context) => value === context.parent.password),
});

const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export { channelNameSchema, signUpSchema, loginSchema };
