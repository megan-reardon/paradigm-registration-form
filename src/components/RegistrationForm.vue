<template>
  <v-img height="100" src="/public/assets/Paradigm_Logo.png" />
  <v-form ref="form" @submit.prevent>
    <v-container class="d-flex justify-center">
      <v-col cols="10" md="4">
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
          type="password"
          label="Confirm Password"
          required
        ></v-text-field>
        <v-btn type="submit" block class="mt-2" @click="submitForm"
          >Submit
        </v-btn>
        <div>
          <p :class="[error ? 'error-message' : 'submit-success-message']">
            {{ feedbackMessage }}
          </p>
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
    feedbackMessage: "",
    confirmedPassword: "",
    error: false,
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
            this.feedbackMessage = "Email already exists";
            this.error = true;
            return;
          } else {
            writeUserData(this.email, encryptPassword(this.password));
            this.feedbackMessage = `Submitted email: ${this.email} successfully`;
            this.resetForm();
          }
        } else {
          this.feedbackMessage = "Please fix or complete the fields above";
          this.error = true;
        }
      } catch (error) {
        console.error(error);
        this.feedbackMessage =
          "An error occurred when trying to submit. Please try again.";
        this.error = true;
      }
    },
    async resetForm() {
      await this.$refs.form.reset();
      this.error = false;

      setTimeout(() => {
        this.feedbackMessage = "";
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

<style scoped>
.submit-success-message {
  color: #007505;
  padding: 6px 16px 0px;
  font-size: 12px;
  letter-spacing: 0.0333333333em;
}

.error-message {
  color: #b00020;
  padding: 6px 16px 0px;
  font-size: 12px;
  letter-spacing: 0.0333333333em;
}

.v-text-field {
  padding-top: 6px;
}
</style>
