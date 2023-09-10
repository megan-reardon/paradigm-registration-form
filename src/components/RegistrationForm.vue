<template>
  <v-form ref="form" lazy-validation @submit.prevent>
    <v-container>
      <v-col cols="12" md="4" pad>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email Address"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          type="password"
          label="Password"
          required
        ></v-text-field>
        <v-text-field
          v-model="confirmedPassword"
          :rules="confirmedPasswordRules"
          label="Confirm Password"
          required
        ></v-text-field>
        <v-btn type="submit" block class="mt-2" @click="submitForm"
          >Submit
        </v-btn>
      </v-col>
    </v-container>
  </v-form>
</template>

<script>
import { writeUserData, getUserData, encryptPassword } from "../firebase/init";

export default {
  data: () => ({
    valid: false,
    password: "",
    confirmedPassword: "",
    passwordRules: [
      (v) =>
        (v && v.length >= 6) || "Password must be at least than 6 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "Email Address is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid",
    ],
  }),
  methods: {
    async submitForm() {
      this.$refs.form.validate();
      const data = await getUserData(this.email);
      if (data) {
        console.log("Email already exists");
        return;
      }
      writeUserData(this.email, encryptPassword(this.password));
      console.log("submitted");
    },
  },
  computed: {
    confirmedPasswordRules() {
      return [
        () => this.password === this.confirmedPassword || "Password must match",
        (v) => !!v || "Confirmation Password is required",
      ];
    },
  },
};
</script>

<style scoped></style>
