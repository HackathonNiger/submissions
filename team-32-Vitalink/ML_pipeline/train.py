import tensorflow as tf
import pandas as pd
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Normalization, Dense, InputLayer
from tensorflow.keras import Input
from tensorflow.keras.models import Model
from tensorflow.keras.metrics import RootMeanSquaredError
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
import numpy as np
from tensorflow.keras.models import load_model

dataset_csv = pd.read_csv("dataset.csv", delimiter=",")

dataset_tf = tf.constant(dataset_csv)
dataset_tf = tf.random.shuffle(dataset_tf)
X = dataset_tf[:, 0:5]
Y = dataset_tf[:, 5:]

N = dataset_tf.shape[0]
TRAIN_RATIO = 0.6
VAL_RATIO = 0.2
TEST_RATIO = 0.2

X_train = X[:int(N*TRAIN_RATIO), :]
Y_train = Y[:int(N*TRAIN_RATIO), :]
X_val = X[int(N*TRAIN_RATIO):int(N*(TRAIN_RATIO+VAL_RATIO)), :]
Y_val = Y[int(N*TRAIN_RATIO):int(N*(TRAIN_RATIO+VAL_RATIO)), :]
X_test = X[int(N*(TRAIN_RATIO+VAL_RATIO)):, :]
Y_test = Y[int(N*(TRAIN_RATIO+VAL_RATIO)):, :]

train_dataset = tf.data.Dataset.from_tensor_slices((X_train, Y_train))
train_dataset = train_dataset.shuffle(buffer_size=5, reshuffle_each_iteration=True).batch(32).prefetch(tf.data.AUTOTUNE)
val_dataset = tf.data.Dataset.from_tensor_slices((X_val, Y_val))
val_dataset = val_dataset.shuffle(buffer_size=5, reshuffle_each_iteration=True).batch(32).prefetch(tf.data.AUTOTUNE)
test_dataset = tf.data.Dataset.from_tensor_slices((X_test, Y_test))
test_dataset = val_dataset.shuffle(buffer_size=5, reshuffle_each_iteration=True).batch(32).prefetch(tf.data.AUTOTUNE)



input = Input(shape = (5,))
x = Dense(50, name = 'dense1', activation="relu")(input)
x = Dense(50, name = 'dense2', activation="relu")(x)
x = Dense(20, name = 'dense3', activation="relu")(x)
output = Dense(2)(x)
model = Model(inputs = input ,outputs = output)
model.compile(loss = 'mse', optimizer = 'adam', metrics=[RootMeanSquaredError()])

model.fit(train_dataset, validation_data=val_dataset, epochs=10, verbose=1)

model.save("model.keras")

print(model.evaluate(X_test, Y_test, batch_size=32))