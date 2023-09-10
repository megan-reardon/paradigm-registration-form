<template>
  <v-form ref="form" @submit.prevent>
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
        <div>
          {{ errorMessage }}
        </div>
      </v-col>
    </v-container>
  </v-form>
</template>

<script>
import { writeUserData, getUserData, encryptPassword } from "../firebase/init";

export default {
  data: () => ({
    password: "",
    errorMessage: "",
    confirmedPassword: "",
    passwordRules: [
      (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "Email Address is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "Email must be valid",
    ],
  }),
  methods: {
    async submitForm() {
      try {
        const { valid } = await this.$refs.form.validate();
        if (valid) {
          const data = await getUserData(this.email);
          if (data) {
            this.errorMessage = "Email already exists";
            return;
          } else {
            writeUserData(this.email, encryptPassword(this.password));
            this.errorMessage = `Submitted email: ${this.email} successfully`;
            this.resetForm();
          }
        } else {
          this.errorMessage = "Please fix the above fields";
        }
      } catch (error) {
        console.error(error);
        this.errorMessage =
          "An error occurred when trying to submit. Please try again.";
      }
    },
    async resetForm() {
      await this.$refs.form.reset();

      setTimeout(() => {
        this.errorMessage = "";
      }, 6000);
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
