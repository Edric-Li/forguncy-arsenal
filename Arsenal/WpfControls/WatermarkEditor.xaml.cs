using System;
using System.Windows;

namespace Arsenal.WpfControls;

public partial class WatermarkEditor : Window
{
    public WatermarkEditor(string indexHtmlPath)
    {
        Loaded += (sender, args) => { webView.Source = new Uri(indexHtmlPath); };
        InitializeComponent();
    }
}