import React from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, Alert } from 'react-native';

interface PaycheckProgressProps {
  daysLeft: number;
  monthDays?: number;
}

/**
 * PaycheckProgress - A component that displays a paycheck countdown with a progress bar
 * 
 * @param daysLeft - Number of days until next paycheck
 * @param monthDays - Total days in current month (defaults to 30)
 * 
 * Usage:
 * <PaycheckProgress daysLeft={20} monthDays={31} />
 */
export const PaycheckProgress: React.FC<PaycheckProgressProps> = ({
  daysLeft = 0,
  monthDays = 30,
}) => {
  const today = new Date();
  const date = today.getDate();
  const [containerWidth, setContainerWidth] = React.useState(0);

  const monthFormat = containerWidth < 400 ? 'short' : 'long';
  const month = today.toLocaleString('default', { month: monthFormat });
  
  const [textWidth, setTextWidth] = React.useState(0);
  const [splitPosition, setSplitPosition] = React.useState(0);
  const fullText = `${daysLeft} days until next pay check`;
  
  const progress = Number(((monthDays - daysLeft) / monthDays * 100).toFixed(2));

  const onTextLayout = (event: LayoutChangeEvent) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth(width);
  };
  
  const fullContainerLength = containerWidth > 0 && textWidth > 0
    ? Math.floor((containerWidth / textWidth) * fullText.length)
    : fullText.length;

  React.useEffect(() => {
    let newSplitPosition = Math.ceil((progress / 100) * fullContainerLength - (fullContainerLength-fullText.length) / 2);
    if (newSplitPosition < 0) {
        newSplitPosition = 0;
    }
    setSplitPosition(newSplitPosition);
  }, [progress, fullContainerLength, fullText]);

  const firstPart = fullText.slice(0, splitPosition);
  const secondPart = fullText.slice(splitPosition);
  
  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      <Text style={styles.dateText}>
        {date} {month}
      </Text>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]}/>
        <View style={styles.textContainer}>
          <View style={styles.progressText} onLayout={onTextLayout}>
            <Text style={styles.whiteText}>{firstPart}</Text>
            <Text style={styles.greyText}>{secondPart}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dateText: {
    fontSize: 24,
    marginRight: 16,
    color: '#000',
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    height: 25,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#4B7BF5',
    borderRadius: 12,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    display: 'flex',
    flexDirection: 'row',
  },
  whiteText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  greyText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
  },
  colorSection: {
    height: '100%',
  },
}); 