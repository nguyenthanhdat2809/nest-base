import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CUSTOM_VALIDATOR_CONST } from "@utils/validator/custom-validator.const";

@ValidatorConstraint()
export class EmojiIconValidate implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    const pattern = CUSTOM_VALIDATOR_CONST.REGEX_PATTERN.EMOJI_REGEX_PATTERN;
    if (pattern.test(text)) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return CUSTOM_VALIDATOR_CONST.MESSAGE.INVALID_EMOJI_INPUT;
  }
}
