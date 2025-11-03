import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final TextEditingController? controller;
  final String hintText;
  final Widget? prefixIcon;
  final IconButton? suffixIcon;
  final bool isObscure;
  final double? corner;
  final TextStyle? style;
  final Color? bg;
  final Color? hintColor;
  final OutlineInputBorder? outlineInputBorder;
  final OutlineInputBorder? outlineFocusInputBorder;
  final Function(String)? onChange;
  final FormFieldSetter<String>? onSaved;
  final Function()? onTap;
  final bool? readOnly;
  final bool? hasBG;
  final int? maxLine;
  final TextInputType? keyboardType;
  final FocusNode? focusNode;
  final FormFieldValidator<String>? validator;
  final Function(String)? onSubmitted;
  final TextAlign? textAlign;

  const CustomTextField({
    super.key,
    this.controller,
    required this.hintText,
    required this.prefixIcon,
    this.suffixIcon,
    this.keyboardType,
    required this.isObscure,
    this.onChange,
    this.onTap,
    this.readOnly,
    this.corner,
    this.focusNode,
    this.maxLine,
    this.onSaved,
    this.validator, this.hasBG, this.bg, this.hintColor, this.outlineInputBorder, this.outlineFocusInputBorder, this.style, this.onSubmitted, this.textAlign,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: isObscure,
      onChanged: onChange,
      focusNode: focusNode,
      maxLines: maxLine ?? 1,
      keyboardType: keyboardType ?? TextInputType.text,
      onTap: onTap,
      cursorColor: Colors.grey,
      onSaved: onSaved,
      readOnly: readOnly ?? false,
      textAlign: textAlign ?? TextAlign.start,
      style: style ?? TextStyle(
          fontSize: 13
      ),
      validator: validator,
      decoration: InputDecoration(
        border: outlineInputBorder ?? OutlineInputBorder(
          borderRadius: BorderRadius.circular(corner ?? 10),
          borderSide: const BorderSide(color: Colors.transparent),
        ),
        focusedBorder: outlineFocusInputBorder ?? OutlineInputBorder(
          borderSide: BorderSide(color: Colors.transparent),
          borderRadius: BorderRadius.circular(corner ?? 10),
        ),
        enabledBorder: outlineInputBorder ?? OutlineInputBorder(
          borderRadius: BorderRadius.circular(corner ?? 10),
          borderSide: BorderSide(color: Colors.transparent),
        ),
        fillColor: bg ?? Colors.grey.withOpacity(0.08),
        filled: hasBG ?? true,
        hintText: hintText,
        hintStyle: TextStyle(
          color: hintColor ?? Colors.grey,
          fontSize: 13,
          fontWeight: FontWeight.w400,
        ),
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
        contentPadding: const EdgeInsets.only(left: 15, right: 5),
      ),
    );
  }
}