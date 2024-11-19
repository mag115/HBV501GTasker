plugins {
	java
	id("org.springframework.boot") version "3.3.3"
	id("io.spring.dependency-management") version "1.1.6"
}

group = "hi.is"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion.set(JavaLanguageVersion.of(17))
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	implementation("org.hibernate.orm:hibernate-community-dialects:6.2.6.Final")
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
	implementation("org.springframework.boot:spring-boot-starter-hateoas")
	implementation("jakarta.servlet:jakarta.servlet-api:5.0.0")
	implementation("jakarta.validation:jakarta.validation-api:3.0.2")
	implementation("jakarta.persistence:jakarta.persistence-api:3.1.0")
	implementation("jakarta.persistence:jakarta.persistence-api:3.1.0") // for JPA annotations
	implementation("jakarta.validation:jakarta.validation-api:3.0.2")   // for validation annotations
	implementation("javax.annotation:javax.annotation-api:1.3.2")
	implementation("com.itextpdf:itextpdf:5.5.13.2")
	implementation("org.apache.pdfbox:pdfbox:2.0.29")
	implementation("io.github.cdimascio:dotenv-java:2.2.4")
	implementation ("org.postgresql:postgresql:42.5.4")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
