SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `echodb` ;
CREATE SCHEMA IF NOT EXISTS `echodb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `echodb` ;

-- -----------------------------------------------------
-- Table `echodb`.`events`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `echodb`.`events` ;

CREATE  TABLE IF NOT EXISTS `echodb`.`events` (
  `eventId` INT ZEROFILL NOT NULL AUTO_INCREMENT ,
  `eventName` VARCHAR(50) NOT NULL ,
  `eventOrganiser` VARCHAR(50) NOT NULL,
  `organiserPassword` VARCHAR(50) NOT NULL,
  `eventDescription` VARCHAR(120) NOT NULL ,
  `eventVenue` VARCHAR(30) NOT NULL ,
  `eventDate` VARCHAR(20) NOT NULL ,
  `eventCharge` VARCHAR(15) NOT NULL ,
  `eventChargeFlag` VARCHAR(10) NOT NULL ,
  PRIMARY KEY (`eventId`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `echodb`.`eventDocuments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `echodb`.`eventDocuments` ;

CREATE  TABLE IF NOT EXISTS `echodb`.`eventDocuments` (
  `documentId` INT ZEROFILL NOT NULL AUTO_INCREMENT ,
  `eventId` INT NOT NULL ,
  `documentPath` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`documentId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `echodb`.`prePartakers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `echodb`.`prePartakers` ;

CREATE  TABLE IF NOT EXISTS `echodb`.`prePartakers` (
  `partakerId` INT ZEROFILL NOT NULL AUTO_INCREMENT ,
  `eventId` INT NOT NULL ,
  `partakerName` VARCHAR(45) NOT NULL ,
  `partakerMail` VARCHAR(45) NOT NULL ,
  `partakerPhone` VARCHAR(45) NOT NULL ,
  `partakerAddress` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`partakerId`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `echodb`.`partakers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `echodb`.`partakers` ;

CREATE  TABLE IF NOT EXISTS `echodb`.`partakers` (
  `partakerId` INT NOT NULL ,
  `partakerUser` VARCHAR(45) NOT NULL ,
  `partakerPassword` VARCHAR(45) NOT NULL ,
  `partakerBaucher` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`partakerId`) )|
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `echodb`.`messagesn`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `echodb`.`messagesn` ;

CREATE  TABLE IF NOT EXISTS `echodb`.`messagesn` (
  `messageId` INT ZEROFILL NOT NULL AUTO_INCREMENT ,
  `eventId` INT NOT NULL ,
  `eventPartakerId` VARCHAR(45) NOT NULL ,
  `mensaje` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`messageId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `echodb`.`echosn`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `echodb`.`echosn` ;

CREATE  TABLE IF NOT EXISTS `echodb`.`echosn` (
  `echoId` INT ZEROFILL NOT NULL AUTO_INCREMENT ,
  `eventId` INT NOT NULL ,
  `echo` VARCHAR(140) NOT NULL ,
  PRIMARY KEY (`echoId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `echodb`.`questionsn`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `echodb`.`questionsn` ;

CREATE  TABLE IF NOT EXISTS `echodb`.`questionsn` (
  `questionId` INT ZEROFILL NOT NULL AUTO_INCREMENT ,
  `eventId` INT NOT NULL ,
  `optionA` INT NULL ,
  `optionB` INT NULL ,
  `optionC` INT NULL ,
  `optionD` INT NULL ,
  PRIMARY KEY (`questionId`))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
